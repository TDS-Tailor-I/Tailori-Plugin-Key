/*
 * jQuery tds.tailori plugin v-8.2 [8d18y/l8.1]
 * Original Author:  @ Sagar Narayane & Rohit Ghadigaonkar
 * Further Changes, comments:
 * Licensed under the Textronics Design System pvt.ltd.
 */
;
(function ($, window, document, undefined) {

    'use strict';
	var tdsTailoriPlugin = 'tailori';

	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = options;
		this.metadata = this.$element.data(tdsTailoriPlugin.toLowerCase() + "-options");
		this._name = tdsTailoriPlugin;
		this.init();

	}

	Plugin.prototype = {
		_Url: "",
		_ImageUrl : "",
		_Links: new Object(),
		_ReverseLinks: new Object(),
		_DoubleLinks: new Object(),
		_BlockedFeatures: new Object(),
		_BlockedDetails: new Object(),
		_BlockedFabrics : new Object(),
		_CurrentBlockedFeatures: Array(),
		_CurrentBlockedDetails: Array(),
		_CurrentBlockedFabrics : Array(),
		_RenderObject: new Object(),
		_Alignments: new Array(),
		_CurrentAlignmentIndex: 0,
		_Swatch: "",
		_Color: "",
		_LSwatch : "",
		_CurrentDetail: "",
		_CurrentContrastNo: "",
		_CurrentOption : "",
		_MonogramPlacement: "",
		_MonogramColor: "",
		_MonogramFont: "",
		_MonogramText: "",
		_MonogramAlignment : "face",
		_MPlacement : new Array(),
		_MFont : new Array(),
		_MColor : new Array(),
		_SpecificImageSource : false,
		_SpecificRender : false,
		_SpecificRenderClick : false,
		_SpecificDisplay: new Object(),
		_SpecificLink: new Object(),
		_SpecificDetails: new Array(),
		_SpecificViewOf: "",
		_IsSpecific: false,
		_ProductData: [],
		_AddOnData : [],
		_LibConfig: new Object,
		_IsAlignmentClick: false,
		_SelectedAlignment: "FACE",
		_IsCustomizeOptions : false,
		_CustomizeOptions : [],
		_SaveLookAlignmentFlag : false,

		defaults: {
			Product: "Men-Shirt",
			ImageSource: "",
			SpecificImageSource : "",
			ProductTemplate: "",
			OptionTemplate: "",
			OptionsPlace: "",
			IsOptionVisible: false,
			FeatureTemplate: "",
			FeaturesPlace: "",
			MonogramTemplate: "",
			IsAddOnOption : false,
			AddOnOptionTemplate : "",
			AddOnOptionsPlace : "",
			Swatch: "",
			ServiceUrl: "http://localhost:57401",
			AutoSpecific: true,
			AutoAlignment: true,
			AutoThread : true,
			ImageSize :"",
			ImageFormat : "jpg",
			OnProductChange: "",
			OnProductDetailChange: "",
			OnOptionChange: "",
			OnFeatureChange: "",
			OnContrastChange: "",
			OnRenderImageChange: "",
			OnLibConfigChange : "",

		},

		init: function () {
			console.info("Textronic jquery.tds.js v-8.2 [8d18y/l8.1]");
			this.config = $.extend({}, this.defaults, this.options, this.metadata);
			this._Swatch = this.Option("Swatch");
			this._setCofiguration(this.Option("Product"));
			return this;
		},
		
		_setCofiguration: function (type) {
			var templateId = this.Option("ProductTemplate");
			if (templateId == "")
				return;

			$.ajax({
				url: this.Option("ServiceUrl") + "/api/products/" + type +"/"+ this.Option("Key"),
				context: this,
				dataType : "json",
				success: function (data) {
					var that = this;
					that._Alignments = data.Alignments;
					that._SpecificDisplay = data.SpecificDisplay;
					that._SpecificLink = data.SpecificLink;
					that._SpecificDetails = data.SpecificDetails;
					that._ProductData = data.Product;
					that._LibConfig = data.LibraryConfig;
					that._MPlacement = data.MonogramPlacement;
					that._MFont = data.MonogramFont;
					that._MColor = data.MonogramColor;
					
					that._CurrentAlignmentIndex = $.inArray( that._SelectedAlignment , that._Alignments);

					/* changes by Rohit */
					if(this.Option("AddOnOption")){
						var addOnTemplateId = this.Option("AddOnOptionTemplate");
						if (addOnTemplateId == "")
							return;
						var i=0;

						$.each(that._ProductData,function(index,value){
							var p = that._ProductData[index].IsAddOn;
							if(that._ProductData[index].IsAddOn){
								that._AddOnData[i] = that._ProductData[index];
								i++;
							}
						});

						var template = $.templates(templateId);
						var htmlOutput = template.render({
								"Product": that._ProductData
							});
						this.$element.html(htmlOutput);

						var addOnUiId = that.Option("AddOnOptionsPlace");
						var template2 = $.templates(addOnTemplateId);
						var htmlOutput2 = template2.render({
								"AddOn": that._AddOnData
							});
						$(addOnUiId).html(htmlOutput2);

						for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
							if (this._ProductData[dataIndex].IsAddOn == true) {
								this.$element.find("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").remove();
								this.$element.find("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").remove();
							}
						}

					}else{
						var template = $.templates(templateId);
						var htmlOutput = template.render({
								"Product": that._ProductData
							});
						this.$element.html(htmlOutput);
					}

					/* End */

					for (var key=0 ;key < this._Alignments.length;key++) {
						if (this._Alignments[key].toLowerCase() == "face")
							this._CurrentAlignmentIndex = key;
					}

					for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
						if (this._ProductData[dataIndex].IsBlock == "True") {
							$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").remove();
							$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").remove();
						}
					}

					var monogram = that.Option("MonogramTemplate");

					if (monogram !== undefined && monogram !== "") {
						var template = $.templates(that.Option('MonogramTemplate'));
						var htmlOutput = template.render(data);
						$(that.Option('MonogramPlace')).html(htmlOutput);

						that._MonogramPlacement = $('[data-tds-mplace]:eq(0)').attr("data-tds-mplace");
						that._MonogramFont = $('[data-tds-mfont]:eq(0)').attr("data-tds-mfont");
						that._MonogramColor = $('[data-tds-mcolor]:eq(0)').attr("data-tds-mcolor");

						$("body").on("click", "[data-tds-mplace]", function () {
							that._MonogramPlacement = $(this).data("tds-mplace");
							
							
							if(that._MPlacement.filter(function(x){x.Id === that._MonogramPlacement})[0].Name.toLowerCase() == "none" ||
							that._MPlacement.filter(function(x){x.Id === that._MonogramPlacement})[0].Name.toLowerCase() == "no monogram"){
								that._MonogramPlacement = "";
								that._MonogramFont = "";
								that._MonogramColor = "" ;
								that._MonogramText = "";
								that._createUrl();
							}else{
								
								if(that._MPlacement.filter(function(x){x.Id === that._MonogramPlacement})[0].Alignment != undefined)
									that._MonogramAlignment = that._MPlacement.filter(function(x){x.Id === that._MonogramPlacement})[0].Alignment;
		
							
								if (that._MonogramPlacement !== "" && that._MonogramFont !== "" && that._MonogramColor !== "" && that._MonogramText !== "")
								{
									that._IsSpecific = false;
									that._SelectedAlignment = that._MonogramAlignment;
									that._CurrentAlignmentIndex = $.inArray( that._SelectedAlignment , that._Alignments);
									that._createUrl();
									
									var callback = that.Option("OnMonogramChange");
									if (typeof callback == 'function')
										callback.call(this, $(this).data("tds-option"));
								}
							}
							
							
						});

						$("body").on("click", "[data-tds-mfont]", function () {

							that._MonogramFont = $(this).data("tds-mfont");
							if (that._MonogramPlacement !== "" && that._MonogramFont !== "" && that._MonogramColor !== "" && that._MonogramText !== "")
							{
								that._IsSpecific = false;
								that._SelectedAlignment = that._MonogramAlignment;
								that._CurrentAlignmentIndex = $.inArray( that._SelectedAlignment , that._Alignments);
								that._createUrl();
								
								var callback = that.Option("OnMonogramChange");
								if (typeof callback == 'function')
									callback.call(this, $(this).data("tds-option"));
							}

						});

						$("body").on("click", "[data-tds-mcolor]", function () {

							that._MonogramColor = $(this).data("tds-mcolor");

							if (that._MonogramPlacement !== "" && that._MonogramFont !== "" && that._MonogramColor !== "" && that._MonogramText !== "")
							{
								that._IsSpecific = false;
								that._SelectedAlignment = that._MonogramAlignment;
								that._CurrentAlignmentIndex = $.inArray( that._SelectedAlignment , that._Alignments);
								that._createUrl();
								
								var callback = that.Option("OnMonogramChange");
								if (typeof callback == 'function')
									callback.call(this, $(this).data("tds-option"));
							}
						});

						$("body").on("change", '[data-tds-moption="text"]', function () {
							that._MonogramText = $(this).val();

							if (that._MonogramPlacement !== "" && that._MonogramFont !== "" && that._MonogramColor !== "" && that._MonogramText !== "")
							{
								that._IsSpecific = false;
								that._SelectedAlignment = that._MonogramAlignment;
								that._CurrentAlignmentIndex = $.inArray( that._SelectedAlignment , that._Alignments);
								that._createUrl();
								
								var callback = that.Option("OnMonogramChange");
								if (typeof callback == 'function')
									callback.call(this, $(this).data("tds-option"));
							}

						});
					}

					$("body").on("click", "[data-tds-element]", function (e) {
						e.stopPropagation();
						var IsFound  = false;
						if ($(this).hasClass("block") || that._CurrentBlockedFeatures.indexOf($(this).attr("data-tds-element")) > -1 || that._CurrentBlockedDetails.indexOf($(this).attr("data-tds-key")) > -1) {
							console.error("feature is block");
						} else {
							that._SpecificViewOf = $(this).attr("data-tds-key");
							that._createRenderObject(that._SpecificViewOf, $(this).attr("data-tds-element"));
							that._SpecificImageSource = false;
							
							for (key=0; key < that._LibConfig.length;key++) {
								if(that._LibConfig[key].Options.indexOf(that._SpecificViewOf) > -1){
									IsFound = true;
								}
							}
						}
						
						if(IsFound){
							var callback = that.Option("OnLibConfigChange");
							if (typeof callback == 'function')
								callback.call(this, $(this).data("tds-key"),$(this).data("tds-element"));
						}else{
							var callback = that.Option("OnFeatureChange");
							if (typeof callback == 'function')
								callback.call(this, $(this).data("tds-element"));
						}
						
					});

					$("body").on("click", "[data-tds-option]", function (e) {
						e.stopPropagation();
						var productId = $(this).data("tds-key");
						var optionId = $(this).data("tds-option");
						that._CurrentOption = optionId;
						var featureTmpl = that.Option("FeatureTemplate");
						var featureUiId = that.Option("FeaturesPlace");
						if (featureTmpl != "" && featureUiId != "" && productId !== undefined && productId !== "" && optionId !== undefined && optionId !== "") {
							var features = null;

							for (var dataIndex = 0; dataIndex < that._ProductData.length; dataIndex++)
								if (that._ProductData[dataIndex].Id == productId) {
									if (optionId == "contrast") {
										features = that._ProductData[dataIndex].Contrasts;
										break;
									} else {
										for (var dataIndex1 = 0; dataIndex1 < that._ProductData[dataIndex].Options.length; dataIndex1++)
											if (that._ProductData[dataIndex].Options[dataIndex1].Id == optionId) {
												features = that._ProductData[dataIndex].Options[dataIndex1].Features;
												break;
											}
									}
								}
							if (features != null) {
								var template1 = $.templates(featureTmpl);
								var htmlOutput1 = template1.render({
										"Features": features
									});
								$(featureUiId).html(htmlOutput1);
								if(that._IsCustomizeOptions){
									if(that._CustomizeOptions[0].length > 0){
										for(var c=0 ; c < that._CustomizeOptions[0].length; c++){
											$("[data-tds-element='" + that._CustomizeOptions[0][c] + "']").addClass("selected");
										}
										for(var f=0;f < features.length;f++){
											if($("[data-tds-element='" + features[f].Id + "']").hasClass("selected")){
												$("[data-tds-element='" + features[f].Id + "']").removeClass("selected");
												continue;
											}
											$("[data-tds-element='" + features[f].Id + "']").remove();
										}
									}
								}
							}
						}

						var callback = that.Option("OnOptionChange");
						if (typeof callback == 'function')
							callback.call(this, $(this).data("tds-option"),that._RenderObject[productId].Id);
					});

					$("body").on("click", "[data-tds-product]", function () {
						
						var selectedId = "";
						this._CurrentOption = that._RenderObject[$(this).data("tds-product")].OptionId;
						if (that.Option("IsOptionVisible")) {
							var productId = $(this).data("tds-product");
							var optionTmpl = that.Option("OptionTemplate");
							var optionUiId = that.Option("OptionsPlace");
							if (optionTmpl != "" && optionUiId != "" && productId !== undefined && productId !== "") {
								var options = [];
								for (var dataIndex = 0; dataIndex < that._ProductData.length; dataIndex++)
									if (that._ProductData[dataIndex].Id == productId) {
										options = $.merge([], that._ProductData[dataIndex].Options);
										if (that._ProductData[dataIndex].Contrasts.length > 0)
											options.push({
												Id: "tds-contrast",
												Name: "Contrast",
												DataAttr: " data-tds-option='contrast' data-tds-key='" + productId + "'"
											});
										break;
									}
									//console.log(options);
								if (options != null) {
									if (options.length > 1) {
										var template1 = $.templates(optionTmpl);
										var htmlOutput1 = template1.render({
												"Options": options
											});
										$(optionUiId).html(htmlOutput1);
										if(that._IsCustomizeOptions){
											if(that._CustomizeOptions[1].length > 0){
												for(var c=0 ; c < that._CustomizeOptions[1].length; c++){
													$("[data-tds-option='" + that._CustomizeOptions[1][c] + "']").addClass("selected");
												}
												for(var f=0;f < options.length;f++){
													if($("[data-tds-option='" + options[f].Id + "']").hasClass("selected")){
														$("[data-tds-option='" + options[f].Id + "']").removeClass("selected");
														continue;
													}
													$("[data-tds-option='" + options[f].Id + "']").remove();
												}
											}
										}
									} else {
										var features = options[0].Features;

										if (features != null) {
											var featureTmpl = that.Option("FeatureTemplate");
											var featureUiId = that.Option("FeaturesPlace");
											var template1 = $.templates(featureTmpl);
											var htmlOutput1 = template1.render({
													"Features": features
												});
											$(featureUiId).html(htmlOutput1);
											if(that._IsCustomizeOptions){
												if(that._CustomizeOptions[0].length > 0){
													for(var c=0 ; c < that._CustomizeOptions[0].length; c++){
														$("[data-tds-element='" + that._CustomizeOptions[0][c] + "']").addClass("selected");
													}
													for(var f=0;f < features.length;f++){
														if($("[data-tds-element='" + features[f].Id + "']").hasClass("selected")){
															$("[data-tds-element='" + features[f].Id + "']").removeClass("selected");
															continue;
														}
														$("[data-tds-element='" + features[f].Id + "']").remove();
													}
												}
											}
										}
									}
								}
							}
						} else {
							var productId = $(this).data("tds-product");
							var featureTmpl = that.Option("FeatureTemplate");
							var featureUiId = that.Option("FeaturesPlace");
							if (featureTmpl != "" && featureUiId != "" && productId !== undefined && productId !== "") {
								var features = [];

								for (var dataIndex = 0; dataIndex < that._ProductData.length; dataIndex++)
									if (that._ProductData[dataIndex].Id == productId)
										for (var dataIndex1 = 0; dataIndex1 < that._ProductData[dataIndex].Options.length; dataIndex1++) {
											features = features.concat(that._ProductData[dataIndex].Options[dataIndex1].Features);
											break;
										}
								if (features != null) {
									var template1 = $.templates(featureTmpl);
									var htmlOutput1 = template1.render({
											"Features": features
										});
									$(featureUiId).html(htmlOutput1);
									if(that._IsCustomizeOptions){
										if(that._CustomizeOptions[0].length > 0){
											for(var c=0 ; c < that._CustomizeOptions[0].length; c++){
												$("[data-tds-element='" + that._CustomizeOptions[0][c] + "']").addClass("selected");
											}
											for(var f=0;f < features.length;f++){
												if($("[data-tds-element='" + features[f].Id + "']").hasClass("selected")){
													$("[data-tds-element='" + features[f].Id + "']").removeClass("selected");
													continue;
												}
												$("[data-tds-element='" + features[f].Id + "']").remove();
											}
										}
									}
								}
							}
						}

						var callback = that.Option("OnProductDetailChange");
						if (typeof callback == 'function')
							callback.call(this, $(this).data("tds-product"),that._RenderObject[$(this).data("tds-product")].OptionId,that._RenderObject[$(this).data("tds-product")].Id);
					});

					$("body").on("click", "[data-tds-contrast]", function (e) {
						//e.stopPropagation();
						var key = $(this).attr("data-tds-key"),
							noContrastFlag=false,
							contrastNo = $(this).attr("data-tds-contrast");
							
						//console.log(that._ProductData.filter(x => x.Id === key)[0].Contrasts[contrastNo].Name);
						
						
						if(that._ProductData.filter(function(x){x.Id === key})[0].Contrasts[contrastNo].Name.toLowerCase() == 'no contrast' ||
							that._ProductData.filter(function(x){x.Id === key})[0].Contrasts[contrastNo].Name.toLowerCase() == 'none'){
							that._RenderObject[key].Contrast = {
								CSwatch : "",
								CColor : "",
								CNo : ""
							};
							that._createUrl();
						}else{
							that._setContrast(key, contrastNo);
						}	
						
						var callback = that.Option("OnContrastChange");
						if (typeof callback == 'function')
							callback.call(this);
					});

					$("body").on("click", "[data-tds-alignment]", function () {
						that._changeAlignment($(this));
					});

					that._linkingBlocking();
					var callback = that.Option("OnProductChange");
					if (typeof callback == 'function')
						callback.call(this, type);
				},
				fail: function () {}
			});
		},

		_createRenderObject: function (key, value) {

			var selectedButton,
				that = this,
				isButton = false,
				buttonId = new Array();
			if (key === undefined) {
				
				var LibconfigName = new Array();
				for(var l = 0 ; l < that._LibConfig.length ; l++){
					if(that._LibConfig[l] == undefined)
						continue
					LibconfigName.push(that._LibConfig[l].Name.toLowerCase());
				}
				//console.log(LibconfigName);
				for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
					if(this._ProductData[dataIndex].Name.toLowerCase().indexOf("buttons") > -1 &&
					LibconfigName.indexOf(this._ProductData[dataIndex].Name.toLowerCase()) > -1){
						
						selectedButton = this._ProductData[dataIndex].Options[0].Features[0].Name.toLowerCase();
						//buttonId.push(this._ProductData[dataIndex].Id);
						buttonId = this._LibConfig[LibconfigName.indexOf(this._ProductData[dataIndex].Name.toLowerCase())].Options;
						isButton = true;
						this._RenderObject[this._ProductData[dataIndex].Id] = {
							Id: this._ProductData[dataIndex].Options[0].Features[0].Id,
							OptionId : this._ProductData[dataIndex].Options[0].Id,
							Swatch: "",
							Color: "",
							Contrast: {
								CSwatch : "",
								CColor : "",
								CNo : ""
							}
						};
					}else{
						this._RenderObject[this._ProductData[dataIndex].Id] = {
							Id: this._ProductData[dataIndex].Options[0].Features[0].Id,
							OptionId : this._ProductData[dataIndex].Options[0].Id,
							Swatch: "",
							Color: "",
							Contrast: {
								CSwatch : "",
								CColor : "",
								CNo : ""
							}
						};
					}
					
					//For 1st time Block
					//------------------
					// if (this._BlockedFeatures.hasOwnProperty(this._RenderObject[key].Id)) {
						// for (var blockedFeature=0; blockedFeature < this._BlockedFeatures[this._RenderObject[key].Id].length;blockedFeature++) {
							// var feature = this._BlockedFeatures[this._RenderObject[key].Id][blockedFeature];
							// this._CurrentBlockedFeatures.push(feature);
							// $("[data-tds-element='" + feature + "']").addClass("block");
						// }
					// }
					
					if (this._BlockedDetails.hasOwnProperty(this._ProductData[dataIndex].Options[0].Features[0].Id)) {
						for (var blockedDetail=0; blockedDetail < this._BlockedDetails[this._ProductData[dataIndex].Options[0].Features[0].Id].length;blockedDetail++) {
							var detail = this._BlockedDetails[this._ProductData[dataIndex].Options[0].Features[0].Id][blockedDetail];
							if(this._CurrentBlockedDetails.indexOf(detail) === -1)
								this._CurrentBlockedDetails.push(detail);
							$("[data-tds-key='" + detail + "']").addClass("block");
						}
					}
					
					/*if(this._BlockedFabrics.hasOwnProperty(this._ProductData[dataIndex].Options[0].Features[0].Id)){
						for (var blockedFeature in this._BlockedFabrics[this._ProductData[dataIndex].Options[0].Features[0].Id]) {
							this._CurrentBlockedFabrics.push(this._BlockedFabrics[this._ProductData[dataIndex].Options[0].Features[0].Id][blockedFeature]);
						}
					}*/
					//--------
				}

			} else if (key !== "") {

				var oldValue = this._RenderObject[key].Id;
				if (this._BlockedFeatures.hasOwnProperty(this._RenderObject[oldValue])) {
					for (var blockedFeature in this._BlockedFeatures[this._RenderObject[oldValue].Id]) {
						var feature = this._CurrentBlockedFeatures[this._RenderObject[key].Id][blockedFeature];
						this._CurrentBlockedFeatures.pop(feature);
						$("[data-tds-element='" + feature + "']").removeClass("block");
					}
				}

				if (this._BlockedDetails.hasOwnProperty(oldValue)) {
					for (var blockedDetail in this._BlockedDetails[oldValue]) {
						var detail = this._BlockedDetails[oldValue][blockedDetail];
						this._CurrentBlockedDetails.pop(detail);
						$("[data-tds-key='" + detail + "']").removeClass("block");
					}
				}
				
				/*if(this._BlockedFabrics.hasOwnProperty(oldValue)){
					for (var blockedFeature in this._BlockedFabrics[oldValue]) {
						this._CurrentBlockedFabrics.pop(this._BlockedFabrics[oldValue][blockedFeature]);
					}
				}*/
				
				var selectedDetailName = "";
				var selectedFeatureName = "";
				var selectedDetailId = "";
				for (var i = 0; i < this._ProductData.length; i++) {
					if (this._ProductData[i].Id == key) {
						selectedDetailName = this._ProductData[i].Name;
						selectedDetailId = this._ProductData[i].Id;
						for (var j = 0; j < this._ProductData[i].Options.length; j++) {
							for (var k = 0; k < this._ProductData[i].Options[j].Features.length; k++) {
								if (this._ProductData[i].Options[j].Features[k].Id == value) {
									if(this.Option("AutoAlignment") && !this._SaveLookAlignmentFlag){
										this._SelectedAlignment = this._ProductData[i].Options[j].Features[k].Alignment;
										if(this._SelectedAlignment.length == 0 || this._SelectedAlignment == undefined)
											this._SelectedAlignment='face';
										for(var l=0;l < this._Alignments.length; l++){
											if(this._SelectedAlignment.toLowerCase() == this._Alignments[l].toLowerCase()){
												this._CurrentAlignmentIndex = l;
											}
										}
									}
									selectedFeatureName = this._ProductData[i].Options[j].Features[k].Name;
								}
							}
						}
					}
				}

				if (selectedDetailName.toLowerCase().indexOf("button") > -1 && this.Option('AutoThread')) {
					// if(selectedDetailName.length == 6){
						// selectedButton = selectedFeatureName;
						// buttonId = selectedDetailId;
						// isButton = true;
					// }
					for (var i = 0; i < this._ProductData.length; i++) {
						var dName = this._ProductData[i].Name.toLowerCase();
						if (dName.indexOf("hole") > -1 || dName.indexOf("thread") > -1) {

							for (var j = 0; j < this._ProductData[i].Options.length; j++) {
								for (var k = 0; k < this._ProductData[i].Options[j].Features.length; k++) {
									if (this._ProductData[i].Options[j].Features[k].Name.toLowerCase() == selectedFeatureName.toLowerCase()) {
										this._RenderObject[this._ProductData[i].Id].Id = this._ProductData[i].Options[j].Features[k].Id;
									}
								}
							}
						}
					}
				}
				this._RenderObject[key].Id = value;
				this._RenderObject[key].OptionId = this._CurrentOption;

				if (this._BlockedFeatures.hasOwnProperty(value)) {
					for (var blockedFeature=0; blockedFeature < this._BlockedFeatures[value].length;blockedFeature++) {
						var feature = this._BlockedFeatures[value][blockedFeature];
						if(this._CurrentBlockedFeatures.indexOf(feature) === -1)
							this._CurrentBlockedFeatures.push(feature);
						$("[data-tds-element='" + feature + "']").addClass("block");
					}
				}

				if (this._BlockedDetails.hasOwnProperty(value)) {
					for (var blockedDetail=0; blockedDetail < this._BlockedDetails[value].length;blockedDetail++) {
						var detail = this._BlockedDetails[value][blockedDetail];
						if(this._CurrentBlockedDetails.indexOf(detail) === -1)
							this._CurrentBlockedDetails.push(detail);
						$("[data-tds-key='" + detail + "']").addClass("block");
					}
				}
				
				/*if(this._BlockedFabrics.hasOwnProperty(oldValue)){
					for (var blockedFeature in this._BlockedFabrics[oldValue]) {
						this._CurrentBlockedFabrics.push(this._BlockedFabrics[oldValue][blockedFeature]);
					}
				}*/
				
				//this._createUrl();
			}

			if(isButton){
				$.ajax({

					url: this.Option("ServiceUrl") + "/v1/Swatches?key="+this.Option("Key")+"&id="+buttonId[0], 
					dataType : "json",
					context: this,
					success: function (data) {
						var swatchId;
						// $.each(data[0],function(index,value){
							// swatchId = value;
							// if(swatchId != undefined || swatchId != "")
								// return false;
						// });
						swatchId = data[0].Id;
						if(buttonId.length > 0)
						{
							for(var i = 0 ; i < buttonId.length; i++){
								that._RenderObject[buttonId[i]].Swatch = swatchId;
								for (var lkey=0; lkey < this._LibConfig.length;lkey++) {
									if(this._LibConfig[lkey].Options.indexOf(buttonId[i]) > -1){
										this._LibConfig[lkey].Swatch = swatchId;
									}
								}
							}
						}
						that._createUrl();
						isButton = false;
					},
					fail: function () {}
				});
			}else{
				this._createUrl();
			}
		},

		_setContrast: function (key, value) {
			this._CurrentContrastNo = value;
			this._CurrentDetail = key;
		},

		_createUrl: function () {
			//this._loader();
			this._Url = "";

			//console.log(this._CurrentBlockedFabrics);
			for (var key in this._RenderObject) {
				if (this._CurrentBlockedDetails.indexOf(key) !== -1)
					continue;
				if (this._CurrentBlockedFeatures.indexOf(this._RenderObject[key].Id) !== -1)
					continue;
				
				

				if (this._IsSpecific)
					if (key !== this._SpecificViewOf && key !== this._SpecificDisplay[this._SpecificViewOf] && this._SpecificDisplay[key] !== this._SpecificViewOf)
						continue;
					else if (this._SpecificLink.hasOwnProperty(this._SpecificViewOf)) {
						if (key !== this._SpecificViewOf && this._SpecificLink[this._SpecificViewOf].indexOf(key) === -1)
							continue;
					}

				var swatch = "";
				if (this._RenderObject[key].Swatch !== "") {
					swatch = "&s=" + this._RenderObject[key].Swatch;
				} else if (this._RenderObject[key].Color !== "") {
					swatch = "&color=" + this._RenderObject[key].Color;
				}

				if (this._DoubleLinks.hasOwnProperty(key)) {

					for (var fLink in this._DoubleLinks[key]) {

						for (var dLink=0; dLink < this._DoubleLinks[key][fLink].length;dLink++) {
							if (swatch !== "")
								this._Url += "p=" + this._RenderObject[key].Id + "&pa=" + this._RenderObject[fLink].Id + "&pap=" + this._RenderObject[this._DoubleLinks[key][fLink][dLink]].Id + swatch + "/";
							else
								this._Url += "p=" + this._RenderObject[key].Id + "&pa=" + this._RenderObject[fLink].Id + "&pap=" + this._RenderObject[this._DoubleLinks[key][fLink][dLink]].Id + "/";
						}
					}

				}

				if (swatch !== "")
					this._Url += "p=" + this._RenderObject[key].Id + swatch + "/";
				else
					this._Url += "p=" + this._RenderObject[key].Id + "/";
				//changes
				if (this._RenderObject[key].Contrast.CNo != "") {
					
						var cSwatch = this._RenderObject[key].Contrast.CSwatch;
						var cColor = this._RenderObject[key].Contrast.CColor;
						if (cSwatch !== "" || cColor !== "") {

							/* change by Rohit */
							//this._Url += "part=" + this._RenderObject[key].Id;

							if (this._DoubleLinks.hasOwnProperty(key)) {
								for (var fLink in this._DoubleLinks[key]) {
										for (var dLink=0; dLink < this._DoubleLinks[key][fLink].length;dLink++) {
											if (swatch !== "")
												this._Url += "p=" + this._RenderObject[key].Id + "&pa=" + this._RenderObject[fLink].Id + "&pap=" + this._RenderObject[this._DoubleLinks[key][fLink][dLink]].Id;
											else
												this._Url += "p=" + this._RenderObject[key].Id + "&pa=" + this._RenderObject[fLink].Id + "&pap=" + this._RenderObject[this._DoubleLinks[key][fLink][dLink]].Id;
										}
								}

							}
							else{
								this._Url += "p=" + this._RenderObject[key].Id;
							}
							/* End */
							this._Url += cSwatch != "" ? "&s=" + this._RenderObject[key].Contrast.CSwatch : "&s=" + this._RenderObject[key].Contrast.CColor;
							this._Url += "&gon=" + this._RenderObject[key].Contrast.CNo + "/";
						}
					
				}

				if (this._ReverseLinks[key] !== undefined) {
					for (var index=0;index < this._ReverseLinks[key].length;index++) {
						if (this._CurrentBlockedDetails.indexOf(this._ReverseLinks[key][index] ) !== -1)
							continue;
						if (this._CurrentBlockedFeatures.indexOf(this._RenderObject[this._ReverseLinks[key][index]].Id ) !== -1)
							continue;
						this._Url += "p=" + this._RenderObject[this._ReverseLinks[key][index]].Id ;
						if (this._RenderObject[this._ReverseLinks[key][index]].Swatch != "")
							this._Url += "&pa=" + this._RenderObject[key].Id + "&s=" + this._RenderObject[this._ReverseLinks[key][index]].Swatch+ "/";
						else
							this._Url += "&pa=" + this._RenderObject[key].Id + "/";
						
						/* changes by Rohit */
						if (this._RenderObject[this._ReverseLinks[key][index]].Contrast.CNo != ""){
							//this._Url  += "&pair=" + this._RenderObject[key].Id + "/";
							
							this._Url += "p=" + this._RenderObject[this._ReverseLinks[key][index]].Id+"&pa=" + this._RenderObject[key].Id + "&s=" + this._RenderObject[this._ReverseLinks[key][index]].Contrast.CSwatch + "&gon="+this._RenderObject[this._ReverseLinks[key][index]].Contrast.CNo + "/";
							
						}else if(this._RenderObject[key].Contrast.CNo != ""){
								//this._Url  += "&pair=" + this._RenderObject[key].Id + "/";
								
									
								// For Buttons(Cotrast)
								//----------------------
								var flag = false;
								for (var lkey=0; lkey < this._LibConfig.length;lkey++) {
									if(this._LibConfig[lkey].Options.indexOf(this._ReverseLinks[key][index]) > -1){
										for (var key1=0; key1 < this._LibConfig[lkey].Options.length; key1++) {
											//this._RenderObject[this._LibConfig[key].Options[key1]].Swatch = id
											if(this._LibConfig[lkey].Options[key1].Swatch != "")
												flag = true;
										}
									}
								}
								
								if(!flag)
									this._Url += "p=" + this._RenderObject[this._ReverseLinks[key][index]].Id + "&pa=" + this._RenderObject[key].Id + "&s=" + this._RenderObject[key].Contrast.CSwatch + "&gon="+this._RenderObject[key].Contrast.CNo + "/";
							
						}
						/* End */
					}
				}

			}
			if (this._Url === "" && !this._IsSpecific)
				return;
			else if (this._Url === "" && this._IsSpecific) {
				this._IsSpecific = false;
				this._createUrl();
				return;
			}

			var monoUrl = "";
			if (this._MonogramText !== "" && !this._IsSpecific) {
				monoUrl = "mp=" + this._MonogramPlacement + "&mf=" + this._MonogramFont + "&mc=" + this._MonogramColor + "&mt=" + this._MonogramText + "/"
			}
			
			if(this._Alignments[this._CurrentAlignmentIndex].toLowerCase() == this._MonogramAlignment.toLowerCase())
					this._Url += monoUrl;
					
			if (this._IsAlignmentClick) {
				
				
				this._Url += "view=" + this._Alignments[this._CurrentAlignmentIndex];
				this._SelectedAlignment = this._Alignments[this._CurrentAlignmentIndex];

				if (!this._IsSpecific)
					this._IsAlignmentClick = false;
			} else {
				
				this._Url += "view=" + this._SelectedAlignment;
					/*for(var index in this._Alignments)
					if(this._Alignments[index]==this._SelectedAlignment)
						this._CurrentAlignmentIndex = index;*/
			}
			var raw = this._Url;
			if (this._IsSpecific)
				this._Url += "/type=3"

				//if (this.Option("AutoSpecific"))
					//this._IsSpecific = true;

			//console.log(this._Url);
			if (this._Url.indexOf("p=") === -1) {
				this._IsSpecific = false;
				this._createUrl();
			}else{
				var url = "";
				if(this.Option("ImageFormat").toLowerCase() == "png" || this.Option("ImageFormat").toLowerCase() == "p")
					url = this.Option("ServiceUrl") + "/v1/imgs?" + this._Url+"&if=png&key="+this.Option("Key");
				else
					url = this.Option("ServiceUrl") + "/v1/imgs?" + this._Url+"&key="+this.Option("Key");
				$.ajax({
					url: url,
					context: this,
					dataType:"json",
					success: function (data) {

						//$(this.Option("ImageSource")).empty();
						if(this._SelectedAlignment.toLowerCase() == "face" && !this._IsSpecific)
							this._ImageUrl = this.Option("ServiceUrl") + "/v1/img?" + this._Url+"&key="+this.Option("Key");
						
						if(!this._SpecificImageSource)
							$(this.Option("SpecificImageSource")).empty();
						
						var isAny = false;
						var className = Date.now();
						var imagesArray = [];
						var c = 1;
						var imgSrc = this.Option("ImageSource");
						
						$(imgSrc).find('.TdsNew').removeClass('TdsNew').addClass('TdsOld');
						
						var specificimgsrc = this.Option("SpecificImageSource");
						var spe = false;
						var dataUrl = "";
						
						if (data.length === 2 && data[0] === "" && data[1].indexOf("Monogram") > 1) {
							isAny = false;
						} else
							for (var url=0;url < data.length;url++) {
								if (data[url] != "") {
									if (imgSrc !== undefined) {
										
										dataUrl = data[url];
										var h = $(imgSrc).height();
										//console.log($(imgSrc).height());
										//h = h.replace("px", "");
										
										if(this.Option('ImageSize') != "" ){
											if(this.Option('ImageSize').toLowerCase() == 'o' || 
											this.Option('ImageSize').toLowerCase() == 'original' ||
											this.Option('ImageSize').toLowerCase() == 'auto')
												dataUrl = data[url];
											else
												dataUrl = data[url] + "?h=" + this.Option('ImageSize') + "&scale=both";
										}else if(h > 1){
											dataUrl += "?h=" + h + "&scale=both";
										}else{
											dataUrl += "?h=1000&scale=both";
										}
										
										if(this._IsSpecific && specificimgsrc != "" && !this._SpecificImageSource){
											$(specificimgsrc).append("<img src='" + dataUrl + "'>");
											//spe = true;
											spe = true;
										}else if(specificimgsrc != "" && !this._SpecificImageSource){
											$(imgSrc).append("<img class='TdsNew' style='opacity:0' c="+ c +" src='" + dataUrl + "'>");
											$(specificimgsrc).append("<img src='" + dataUrl + "'>");
										}
										else
											$(imgSrc).append("<img class='TdsNew' style='opacity:0' c="+ c +" src='" + dataUrl + "'>");
									}
									imagesArray.push(data[url]);
									if(specificimgsrc != "" && this._IsSpecific && !this._SpecificRender)
										isAny = false;
									else
										isAny = true;
									
									c++;
								}
							}
							
							
							
						if(spe)
							this._SpecificImageSource = true;
						
						if (this.Option("AutoSpecific"))
							this._IsSpecific = true;
						
						if(this._SpecificRender)
							this._SpecificRender = false;
						
						if (!isAny) {
							this._IsSpecific = false;
							this._createUrl();
						} else {
							$(imgSrc + " img:last").attr("data-zoom-image", this.Option("ServiceUrl") + "/v1/img?key="+this.Option("Key") + "&"+ raw + "/type=5");
							
							var that = this;
							var loadedImage = 0;
							
							$(imgSrc + ' .TdsNew').on('load', function() {
								//console.log($(this).attr('c')); 
								loadedImage++;
								if(loadedImage == $(imgSrc + ' .TdsNew').length){
									
									//$(imgSrc + ' .TdsNew').css('opacity','1');
									for (var i = 0,t=50; i < 1.0; i += 0.1) {
										that._effect(imgSrc,i.toFixed(1).toString(),t);
										t =t+50;
									}
									//$(imgSrc + ' .TdsOld').remove();
									loadedImage = 0;
									
									var callback = that.Option("OnRenderImageChange");
									if (typeof callback == 'function')
									callback.call(that, imagesArray);
								}
							}).each(function() {
							  if(this.complete) $(this).load();
							});
							
						}
					},
					fail: function () {}
				});
			}

		},
		_effect : function(imgSrc,i,t){
			setTimeout(function(){
				$(imgSrc).find('.TdsNew').css('opacity',i);
				//console.log(i)
				if((1.0 - i).toFixed(1) == 0.0){
					$(imgSrc + ' .TdsOld').remove();
				}
					
			},t);
			// setTimeout(function(){
				// $(imgSrc).find('.TdsOld').css('opacity',(1.0 - i).toFixed(1));
				////console.log((1.0 - i).toFixed(1));
				// if((1.0 - i).toFixed(1) == 0.0)
					// $(imgSrc + ' .TdsOld').remove();
			// },t);
		},
		_linkingBlocking: function () {
			$.ajax({
				url: this.Option("ServiceUrl") + "/api/products/" + this.Option("Product") + "/link"+"/"+this.Option("Key"),
				context: this,
				dataType : "json",
				success: function (data) {
					this._Links = data.Link;
					this._ReverseLinks = data.ReverseLink;
					this._DoubleLinks = data.DoubleLinking;
					this._BlockedFeatures = data.Block;
					this._BlockedDetails = data.BlockDetail;
					this._BlockedFabrics = data.BlockFabrics;
					this._createRenderObject();
				},
				fail: function () {}
			});
		},

		_changeAlignment: function ($alignEle) {
			this._IsAlignmentClick = true;
			this._IsSpecific = false;
			this._SpecificImageSource = false;
			var align = $alignEle.data("tds-alignment").toLowerCase();

			if (align == "next") {
				if (this._Alignments.length - 1 == this._CurrentAlignmentIndex)
					this._CurrentAlignmentIndex = 0;
				else
					this._CurrentAlignmentIndex++;
			} else if (align == "previous") {
				if (this._CurrentAlignmentIndex == 0)
					this._CurrentAlignmentIndex = this._Alignments.length - 1;
				else
					this._CurrentAlignmentIndex--;
			} else
				for (var key=0 ;key < this._Alignments.length;key++) {
						if (this._Alignments[key].toLowerCase() == align)
							this._CurrentAlignmentIndex = key;
				}
			this._createUrl();
		},

		publicMethod: function (foo) {
			alert(foo);
		},

		Option: function (key, val) {
			if (val) {
				this.config[key] = val;
			} else if (key) {
				return this.config[key];
			}
		},

		destroy: function () {

			this.$el.removeData();
		},
		_unregisterEvents: function () {
			$("body").off('click', "[data-tds-mplace]");
			$("body").off('click', "[data-tds-mfont]");
			$("body").off('click', "[data-tds-mcolor]");
			$("body").off('change', '[data-tds-moption="text"]');
			$("body").off('click', "[data-tds-element]");
			$("body").off('click', "[data-tds-option]");
			$("body").off('click', "[data-tds-product]");
			$("body").off('click', "[data-tds-contrast]");
			$("body").off('click', "[data-tds-alignment]");
		},
		/*_loader: function(){
			$(this.Option("ImageSource")).find("img").removeClass("new").addClass("old");
			$(this.Option("ImageSource")).find(".old").css("filter","blur(3px)");

		},*/
		Product: function (product) {

			this._Url = "";
			this._Links = new Object();
			this._ReverseLinks = new Object();
			this._DoubleLinks = new Object();
			this._BlockedFeatures = new Object();
			this._BlockedDetails = new Object();
			this._CurrentBlockedFeatures = Array();
			this._CurrentBlockedDetails = Array();
			this._RenderObject = new Object();
			this._Alignments = new Array();
			this._CurrentAlignmentIndex = 0;
			this._Swatch = "";
			this._Color = "";
			this._CurrentDetail = "";
			this._CurrentContrastNo = "";
			this._MonogramPlacement = "";
			this._MonogramColor = "";
			this._MonogramFont = "";
			this._MonogramText = "";
			this._AddOnData = [];
			this._SpecificDisplay = new Object();
			this._SpecificLink = new Object();
			this._SpecificViewOf = "";
			this._unregisterEvents();
			this._SpecificImageSource = false;
			this.Option("Product", product);
			this._setCofiguration(product, this.Option("ProductTemplate"));
			this._IsCustomizeOptions = false;
			this._CustomizeOptions = [];
			this._SelectedAlignment = "face";
		},

		Texture: function (id) {
			if (id === undefined) {
				if (this._Swatch === "")
					return this._Color;
				else
					return this._Swatch;
			}else{
				if(this._CurrentBlockedFabrics.indexOf(id) > -1){
					console.log("Fabric is Block");
					return false;
				}else{
					var oldValue = this._Swatch;
					if(oldValue != "" || oldValue != undefined){
						for(var feature in this._BlockedFabrics){
							if(this._BlockedFabrics[feature].indexOf(oldValue) > -1){
								this._CurrentBlockedFeatures.pop(feature);
								$("[data-tds-element='" + this._BlockedFabrics[feature] + "']").removeClass("block");
							}
						}
					}
					
					for(var feature in this._BlockedFabrics){
						if(this._BlockedFabrics[feature].indexOf(id) > -1){
							this._CurrentBlockedFeatures.push(feature);
							$("[data-tds-element='" + this._BlockedFabrics[feature] + "']").addClass("block");
						}
					}
				}
			}

			var falseArray = new Array();
			
			for (key=0; key < this._LibConfig.length;key++) {
				if (this._LibConfig[key].Name.toLowerCase().indexOf("waist") > -1 || 
				this._LibConfig[key].Name.toLowerCase().indexOf("trouser") > -1){
					continue;
				}else{
					for (var key1 = 0;key1 < this._LibConfig[key].Options.length;key1++) {
						falseArray.push(this._LibConfig[key].Options[key1]);
					}

				}
			}

			
			for (var key in this._RenderObject) {
				if (falseArray.indexOf(key) === -1) {
					this._RenderObject[key].Swatch = id
				}
			}

		
			var color = parseColor(id);
			if (color === undefined)
				this._Swatch = id;
			else
				this._Color = color;
			
			if(!this._SpecificRenderClick && this._IsSpecific)
				this._IsSpecific = false;
			
			this._SpecificImageSource = false;
			//this._IsSpecific = false;
			this._createUrl();

		},

		ContrastTexture: function (id) {
			if (id === undefined)
				return;
			var color = parseColor(id);
			if (color === undefined)
				color = "";
			else
				id = "";
			
			
			this._RenderObject[this._CurrentDetail].Contrast.CSwatch = id;
			this._RenderObject[this._CurrentDetail].Contrast.CColor = color;
			this._RenderObject[this._CurrentDetail].Contrast.CNo = this._CurrentContrastNo;
		
			// if (this._RenderObject[this._CurrentDetail].Contrast.hasOwnProperty(this._CurrentContrastNo)) {
				// this._RenderObject[this._CurrentDetail].Contrast[this._CurrentContrastNo].Swatch = id;
				// this._RenderObject[this._CurrentDetail].Contrast[this._CurrentContrastNo].Color = color;
			// } else {
				// this._RenderObject[this._CurrentDetail].Contrast[this._CurrentContrastNo] = {
					// Swatch: id,
					// Color: color
				// };
			// }
			
			if(!this._SpecificRenderClick && this._IsSpecific)
				this._IsSpecific = false;
			
			this._SpecificImageSource = false;
			this._createUrl();

		},
		
		LibConfigTexture : function(id){
			
			if (id === undefined){
				return this._LSwatch;
			}else{
				if(this._CurrentBlockedFabrics.indexOf(id) > -1){
					console.log("Fabric is Block");
					return false;
				}else{
					var oldValue = this._LSwatch;
					if(oldValue != "" || oldValue != undefined){
						for(var feature in this._BlockedFabrics){
							if(this._BlockedFabrics[feature].indexOf(oldValue) > -1){
								this._CurrentBlockedFeatures.pop(feature);
								$("[data-tds-element='" + this._BlockedFabrics[feature] + "']").removeClass("block");
							}
						}
					}
					
					for(var feature in this._BlockedFabrics){
						if(this._BlockedFabrics[feature].indexOf(id) > -1){
							this._CurrentBlockedFeatures.push(feature);
							$("[data-tds-element='" + this._BlockedFabrics[feature] + "']").addClass("block");
						}
					}
				}
			}
			
			var color = parseColor(id);
			if (color === undefined)
				color = "";
			else
				id = "";
			
			var isFound = false;
			for (var i=0; i < this._LibConfig.length;i++) {
				var indexOf = this._LibConfig[i].Options.indexOf(this._SpecificViewOf);
				if (indexOf > -1) {
					isFound = true;
					for (var key1=0; key1 < this._LibConfig[i].Options.length; key1++) {
						this._RenderObject[this._LibConfig[i].Options[key1]].Swatch = id
					}
					this._LibConfig[i].Swatch = id;
				} 
			}
			
			if(isFound){
				if(!this._SpecificRenderClick && this._IsSpecific)
				this._IsSpecific = false;
			
				this._SpecificImageSource = false;
				//this._IsSpecific = false;
				this._LSwatch = id;
				this._createUrl();
			}else{
				return false;
			}
			
			
		},
		
		Summary: function () {

			var selectedElements = new Array();

			var selectedContrast = new Array();

			var selectedTextures = new Array();

			var selectedMonogram = new Array();

			var monogram = false;

			if(this._MonogramPlacement != "" && this._MonogramColor != "" && this._MonogramFont != "" && this._MonogramText != "")
			{
				selectedMonogram.push({
					'MonogramText' : this._MonogramText.toString(),
					'MonogramPlacement' : this._MonogramFont.toString(),
					'MonogramFont' : this._MonogramPlacement.toString(),
					'MonogramColor' : this._MonogramColor.toString()
				});
				monogram = true;
			}

			selectedTextures.push({
				'Detail': 'All',
				'ContrastNo': '0',
				'FabricId': this._Swatch,
				'Color': this._Color
			});


			for (var key=0; key < this._LibConfig.length;key++){
				if(this._LibConfig[key].swatch != undefined || this._LibConfig[key].swatch != ""){
					selectedTextures.push({
						'Detail' : this._LibConfig[key].Name,
						'ContrastNo': '0',
						'FabricId': this._LibConfig[key].Swatch,
						'Color': this._Color
					})
				}
			}

			for (var key in this._RenderObject) {
				
				if (this._CurrentBlockedDetails.indexOf(key) !== -1)
					continue;
				if (this._CurrentBlockedFeatures.indexOf(this._RenderObject[key].Id) !== -1)
					continue;
				
				selectedElements.push(this._RenderObject[key].Id);
				
				selectedContrast.push({
					'Detail': key,
					'ContrastNo': this._RenderObject[key].Contrast.CNo,
					'FabricId': this._RenderObject[key].Contrast.CSwatch,
					'Color': this._RenderObject[key].Contrast.CColor
				});

				

			}
			var a = {
				"Product": selectedElements,
				"Contrast": selectedContrast,
				"Swatch": selectedTextures,
				"key": this.Option("Key"),
				"Monogram" : selectedMonogram
			};
			//console.log(JSON.stringify(a));
			var returnData = null;

			$.ajax({
				type: 'POST',
				url: this.Option("ServiceUrl") + "/api/products"+"/",
				data: a,
				async: false,
				success: function (data1) {
					returnData = data1;
				},
				fail: function () {
					//alert(0);
				}
			});
			return returnData;

		},

		Look: function (rawRenderData) {
			if (rawRenderData === undefined) {
				var lookData = {
					'RO': this._RenderObject,
					'BF': this._CurrentBlockedFeatures,
					'BD': this._CurrentBlockedDetails,
					'S': this._Swatch,
					'C': this._Color,
					'MP': this._MonogramPlacement,
					'MC': this._MonogramColor,
					'MF': this._MonogramFont,
					'MT': this._MonogramText,
					'AI': this._CurrentAlignmentIndex
				};


				var url = this.Option("ServiceUrl") + "/v1/img?" + this._Url + "&key=" + this.Option("Key");

				return {
					'Data': btoa(JSON.stringify(lookData)),
					'Url' : url
				};
			}
			else if(rawRenderData.toLowerCase() === "image"){
				var image = "";
				$.ajax({
					url: this._ImageUrl,
					type: "GET",
					processData: false,
					async: false,
					beforeSend: function (xhr) {
						xhr.overrideMimeType('text/plain; charset=x-user-defined');
					},
					success: function (result, textStatus, jqXHR) {       
						if(result.length < 1){
							console.error("The Image doesn't exist");
							return
						}

						var binary = "";
						var responseText = jqXHR.responseText;
						var responseTextLen = responseText.length;

						for ( i = 0; i < responseTextLen; i++ ) {
							binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
						}
						image = "data:image/png;base64," + btoa(binary);
					},
					error: function(xhr, textStatus, errorThrown){
						console.error("Error in getting document "+textStatus);
					} 
				});
				return image;
			}
			else {
				var lookData = JSON.parse(atob(rawRenderData));

				this._RenderObject = lookData.RO;
				this._CurrentBlockedFeatures = lookData.BF;
				this._CurrentBlockedDetails = lookData.BD;
				this._Swatch = lookData.S;
				this._Color = lookData.C;
				this._MonogramPlacement = lookData.MP;
				this._MonogramColor = lookData.MC;
				this._MonogramFont = lookData.MF;
				this._MonogramText = lookData.MT;
				this._CurrentAlignmentIndex = lookData.AI;
				this._SaveLookAlignmentFlag = true; 
				this._SelectedAlignment = this._Alignments[this._CurrentAlignmentIndex];
				this._createRenderObject("");
				this._SaveLookAlignmentFlag = false;
			}
		},

		_dataURItoBlob: function (dataURI) {
			var binary = atob(dataURI.split(',')[1]);
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {
				type: 'image/png'
			});
		},

		SpecificDetails: function () {
			return this._SpecificDetails;
		},

		SpecificRender: function (specific) {
			if (specific === undefined)
				return;
			if (typeof specific == 'boolean') {
				this._IsSpecific = specific;
				this._SpecificRenderClick = specific;
				this._createUrl();
			} else if (typeof specific == 'string') {
				for (var i = 0; i < this._ProductData.length; i++) {
					if (this._ProductData[i].Id == specific)
						this._SelectedAlignment = this._ProductData[i].Options[0].Features[0].Alignment;
				}
				this._SpecificViewOf = specific;
				this._SpecificRenderClick = true;
				this._IsSpecific = true;
				this._SpecificImageSource = true;
				this._SpecificRender = true;
				this._createUrl();
			}

		},

		ResetContrast: function () {
			
			for (var key in this._RenderObject){
				this._RenderObject[key].Contrast = {
					CSwatch : "",
					CColor : "",
					CNo : ""
				}
			}
			
			this._createUrl();
		},

		ResetProduct: function () {
			this._CurrentBlockedFeatures = Array();
			this._CurrentBlockedDetails = Array();
			this._Swatch = "";
			this._Color = "";
			this._SelectedAlignment = "face";
			this._MonogramPlacement = "";
			this._MonogramColor = "";
			this._MonogramFont = "";
			this._MonogramText = "";
			this._IsSpecific = false;
			
			for (var lkey=0; lkey < this._LibConfig.length;lkey++) 
				this._LibConfig[lkey].Swatch = "";
				
			this._createRenderObject();
		},

		Features: function (productId, optionId) {
			if (productId !== undefined && productId !== "" && optionId !== undefined && optionId !== "")
				for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++)
					if (this._ProductData[dataIndex].Id == productId)
						for (var dataIndex1 = 0; dataIndex1 < this._ProductData[dataIndex].Options.length; dataIndex1++)
							if (this._ProductData[dataIndex].Options[dataIndex1].Id == optionId)
								return this._ProductData[dataIndex].Options[dataIndex1].Features;

			return null;
		},

		Options: function (productId) {
			if (productId !== undefined && productId !== "")
				for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++)
					if (this._ProductData[dataIndex].Id == productId) {
						var options = $.merge([], this._ProductData[dataIndex].Options);
						return options;
					}

			return null;
		},

		Contrasts: function (productId) {
			if (productId !== undefined && productId !== "")
				for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++)
					if (this._ProductData[dataIndex].Id == productId) {
						var contrast = this._ProductData[dataIndex].Contrasts;
						return contrast;
					}

			return null;
		},
		
		Monogram : function(){
			
			if(this._MPlacement.length > 0){
				var monogram = {
					"MonogramPlacement" : this._MPlacement,
					"MonogramFont" : this._MFont,
					"MonogramColor" : this._MColor
				}
				
				return monogram;
			}
			return null;
		},
		
		CustomizeOptions: function (productDetailArray,featureArray) {
			if(this.Option("IsOptionVisible")){
				if(productDetailArray != undefined && featureArray == undefined){
				for(var dataIndex=0; dataIndex < productDetailArray.length ; dataIndex++){
					$("[data-tds-product='" + productDetailArray[dataIndex] + "']").addClass("selected");
				}
				for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
						if ($("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ||
									$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ){
							$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
							$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
							continue;
						}

						$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").remove();
						$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").remove();
					}
				}else if(productDetailArray != undefined && featureArray != undefined){
					for(var dataIndex=0; dataIndex < productDetailArray.length ; dataIndex++){
						$("[data-tds-product='" + productDetailArray[dataIndex] + "']").addClass("selected");
					}
					this._IsCustomizeOptions = true;
					this._CustomizeOptions.push(featureArray);

					var optionarray = [];
					for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
						for(var o = 0;o < this._ProductData[dataIndex].Options.length;o++){
							for(var f = 0;f < this._ProductData[dataIndex].Options[o].Features.length;f++){
								for(var fa = 0;fa < featureArray.length;fa++){
									if(featureArray[fa] == this._ProductData[dataIndex].Options[o].Features[f].Id){
										var check = $.inArray(this._ProductData[dataIndex].Options[o].Id,optionarray);
										if(check != -1)
											continue;
										else
											optionarray.push(this._ProductData[dataIndex].Options[o].Id);
									}

								}
							}
						}
					}
					// console.log(optionarray);
					this._CustomizeOptions.push(optionarray);
					for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
							if ($("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ||
										$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ){
								$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
								$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
								continue;
							}

							$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").remove();
							$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").remove();
						}

				}else{
					console.log("null");
				}
			}else{
				if(productDetailArray != undefined && featureArray != undefined){
					for(var dataIndex=0; dataIndex < productDetailArray.length ; dataIndex++){
						$("[data-tds-product='" + productDetailArray[dataIndex] + "']").addClass("selected");
					}
					for(var dataIndex=0; dataIndex < featureArray.length ; dataIndex++){
						$("[data-tds-element='" + featureArray[dataIndex] + "']").addClass("selected");
					}
					var optionarray = [];
					for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
						for(var o = 0;o < this._ProductData[dataIndex].Options.length;o++){
							for(var f = 0;f < this._ProductData[dataIndex].Options[o].Features.length;f++){
								for(var fa = 0;fa < featureArray.length;fa++){
									if(featureArray[fa] == this._ProductData[dataIndex].Options[o].Features[f].Id){
										var check = $.inArray(this._ProductData[dataIndex].Options[o].Id,optionarray);
										if(check != -1)
											continue;
										else
											optionarray.push(this._ProductData[dataIndex].Options[o].Id);
									}

								}
							}
						}
					}
					//console.log(optionarray);
					for(var dataIndex=0; dataIndex < optionarray.length ; dataIndex++){
						$("[data-tds-option='" + optionarray[dataIndex] + "']").addClass("selected");
					}
					for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
							if ($("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ||
										$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ){
											for(var o=0 ; o < this._ProductData[dataIndex].Options.length; o++ ){
												if(!$("[data-tds-option='" + this._ProductData[dataIndex].Options[o].Id + "']").hasClass("selected"))
													$("[data-tds-option='" + this._ProductData[dataIndex].Options[o].Id + "']").remove();
												for(var f=0;f < this._ProductData[dataIndex].Options[o].Features.length;f++ ){
													if($("[data-tds-element='" + this._ProductData[dataIndex].Options[o].Features[f].Id + "']").hasClass("selected")){
														$("[data-tds-element='" + this._ProductData[dataIndex].Options[o].Features[f].Id + "']").removeClass("selected");
															continue;
													}
													else{
															$("[data-tds-element='" + this._ProductData[dataIndex].Options[o].Features[f].Id + "']").remove();
														}
												}
											}
								$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
								$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
								continue;
							}

							$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").remove();
							$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").remove();
						}
				}else if(productDetailArray != undefined && featureArray == undefined){
					for(var dataIndex=0; dataIndex < productDetailArray.length ; dataIndex++){
						$("[data-tds-product='" + productDetailArray[dataIndex] + "']").addClass("selected");
					}
					for (var dataIndex = 0; dataIndex < this._ProductData.length; dataIndex++) {
							if ($("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ||
										$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").hasClass("selected") ){
								$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
								$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").removeClass("selected");
								continue;
							}

							$("[data-tds-key='" + this._ProductData[dataIndex].Id + "']").remove();
							$("[data-tds-product='" + this._ProductData[dataIndex].Id + "']").remove();
						}
				}else{
					console.log("null");
				}
			}
			return null;
		}

	};

	function parseColor(color) {
		color = color.trim().toLowerCase();
		color = _colorsByName[color] || color;
		var hex3 = color.match(/^#([0-9a-f]{3})$/i);
		if (hex3) {
			return color.replace("#", "");
		}
		var hex6 = color.match(/^#([0-9a-f]{6})$/i);
		if (hex6) {
			return color.replace("#", "");
		}
		var rgba = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i) || color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if (rgba) {
			return hex(rgba[1]) + hex(rgba[2]) + hex(rgba[3]);
		}
		var rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if (rgb) {
			return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
		if (color.indexOf('hsl') == 0)
			return parseColor(_hslToRgb(color));
	}

	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}

	function _hslToRgb(hsl) {
		if (typeof hsl == 'string') {
			hsl = hsl.match(/(\d+(\.\d+)?)/g);
		}
		var sub,
		h = hsl[0] / 360,
		s = hsl[1] / 100,
		l = hsl[2] / 100,
		a = hsl[3] === undefined ? 1 : hsl[3],
		t1,
		t2,
		t3,
		rgb,
		val;
		if (s == 0) {
			val = Math.round(l * 255);
			rgb = [val, val, val, a];
		} else {
			if (l < 0.5)
				t2 = l * (1 + s);
			else
				t2 = l + s - l * s;
			t1 = 2 * l - t2;
			rgb = [0, 0, 0];
			for (var i = 0; i < 3; i++) {
				t3 = h + 1 / 3 *  - (i - 1);
				t3 < 0 && t3++;
				t3 > 1 && t3--;
				if (6 * t3 < 1)
					val = t1 + (t2 - t1) * 6 * t3;
				else if (2 * t3 < 1)
					val = t2;
				else if (3 * t3 < 2)
					val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
				else
					val = t1;
				rgb[i] = Math.round(val * 255);
			}
		}
		rgb.push(a);
		return rgb;
	}

	var _colorsByName = {
		aliceblue: "#f0f8ff",
		antiquewhite: "#faebd7",
		aqua: "#00ffff",
		aquamarine: "#7fffd4",
		azure: "#f0ffff",
		beige: "#f5f5dc",
		bisque: "#ffe4c4",
		black: "#000000",
		blanchedalmond: "#ffebcd",
		blue: "#0000ff",
		blueviolet: "#8a2be2",
		brown: "#a52a2a",
		burlywood: "#deb887",
		cadetblue: "#5f9ea0",
		chartreuse: "#7fff00",
		chocolate: "#d2691e",
		coral: "#ff7f50",
		cornflowerblue: "#6495ed",
		cornsilk: "#fff8dc",
		crimson: "#dc143c",
		cyan: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgoldenrod: "#b8860b",
		darkgray: "#a9a9a9",
		darkgreen: "#006400",
		darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",
		darkolivegreen: "#556b2f",
		darkorange: "#ff8c00",
		darkorchid: "#9932cc",
		darkred: "#8b0000",
		darksalmon: "#e9967a",
		darkseagreen: "#8fbc8f",
		darkslateblue: "#483d8b",
		darkslategray: "#2f4f4f",
		darkturquoise: "#00ced1",
		darkviolet: "#9400d3",
		deeppink: "#ff1493",
		deepskyblue: "#00bfff",
		dimgray: "#696969",
		dodgerblue: "#1e90ff",
		firebrick: "#b22222",
		floralwhite: "#fffaf0",
		forestgreen: "#228b22",
		fuchsia: "#ff00ff",
		gainsboro: "#dcdcdc",
		ghostwhite: "#f8f8ff",
		gold: "#ffd700",
		goldenrod: "#daa520",
		gray: "#808080",
		green: "#008000",
		greenyellow: "#adff2f",
		honeydew: "#f0fff0",
		hotpink: "#ff69b4",
		indianred: "#cd5c5c",
		indigo: "#4b0082",
		ivory: "#fffff0",
		khaki: "#f0e68c",
		lavender: "#e6e6fa",
		lavenderblush: "#fff0f5",
		lawngreen: "#7cfc00",
		lemonchiffon: "#fffacd",
		lightblue: "#add8e6",
		lightcoral: "#f08080",
		lightcyan: "#e0ffff",
		lightgoldenrodyellow: "#fafad2",
		lightgray: "#d3d3d3",
		lightgreen: "#90ee90",
		lightpink: "#ffb6c1",
		lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",
		lightskyblue: "#87cefa",
		lightslategray: "#778899",
		lightsteelblue: "#b0c4de",
		lightyellow: "#ffffe0",
		lime: "#00ff00",
		limegreen: "#32cd32",
		linen: "#faf0e6",
		magenta: "#ff00ff",
		maroon: "#800000",
		mediumaquamarine: "#66cdaa",
		mediumblue: "#0000cd",
		mediumorchid: "#ba55d3",
		mediumpurple: "#9370db",
		mediumseagreen: "#3cb371",
		mediumslateblue: "#7b68ee",
		mediumspringgreen: "#00fa9a",
		mediumturquoise: "#48d1cc",
		mediumvioletred: "#c71585",
		midnightblue: "#191970",
		mintcream: "#f5fffa",
		mistyrose: "#ffe4e1",
		moccasin: "#ffe4b5",
		navajowhite: "#ffdead",
		navy: "#000080",
		oldlace: "#fdf5e6",
		olive: "#808000",
		olivedrab: "#6b8e23",
		orange: "#ffa500",
		orangered: "#ff4500",
		orchid: "#da70d6",
		palegoldenrod: "#eee8aa",
		palegreen: "#98fb98",
		paleturquoise: "#afeeee",
		palevioletred: "#db7093",
		papayawhip: "#ffefd5",
		peachpuff: "#ffdab9",
		peru: "#cd853f",
		pink: "#ffc0cb",
		plum: "#dda0dd",
		powderblue: "#b0e0e6",
		purple: "#800080",
		red: "#ff0000",
		rosybrown: "#bc8f8f",
		royalblue: "#4169e1",
		saddlebrown: "#8b4513",
		salmon: "#fa8072",
		sandybrown: "#f4a460",
		seagreen: "#2e8b57",
		seashell: "#fff5ee",
		sienna: "#a0522d",
		silver: "#c0c0c0",
		skyblue: "#87ceeb",
		slateblue: "#6a5acd",
		slategray: "#708090",
		snow: "#fffafa",
		springgreen: "#00ff7f",
		steelblue: "#4682b4",
		tan: "#d2b48c",
		teal: "#008080",
		thistle: "#d8bfd8",
		tomato: "#ff6347",
		turquoise: "#40e0d0",
		violet: "#ee82ee",
		wheat: "#f5deb3",
		white: "#ffffff",
		whitesmoke: "#f5f5f5",
		yellow: "#ffff00",
		yellowgreen: "#9acd32"
	};

	Plugin.defaults = Plugin.prototype.defaults;

	$.fn[tdsTailoriPlugin] = function (options) {
		var args = arguments;
		if (options === undefined || typeof options === "object") {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + tdsTailoriPlugin)) {
					$.data(this, 'plugin_' + tdsTailoriPlugin,
						new Plugin(this, options));
				}
			}).data('plugin_' + tdsTailoriPlugin);
		} else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
			var returns;
			this.each(function () {
				var instance = $.data(this, "plugin_" + tdsTailoriPlugin);
				if (instance instanceof Plugin && typeof instance[options] === "function") {
					//alert(6);
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
			});
			return returns !== undefined ? returns.data('plugin_' + tdsTailoriPlugin) : this.data('plugin_' + tdsTailoriPlugin);
		}
	}
})(window.jQuery, window, document);
