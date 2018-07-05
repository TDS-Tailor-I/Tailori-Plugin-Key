<img src="icon.png" align="right" />

# Tailori API 

Textronics Design System have created an interactive platform for bespoke clothing. Textronics Tailori API is a plugin that simplifies access to the functionality of textronics services.

# Features

To know more about features of TheGuide, continue reading our documentation and check our available components.     
It provides following features:

* [Element Rendering](#)  
  It allows you to render Product, Options & Features.   
	
* [Contrast Options](#)  
  Allows to apply contrast fabric on the product.
  
* [Monogram](#)  
  This feature allows to give Company Branding on Prouduct i.e, Company Name, Logo, etc.
  
* [Auto Specific view](#)  
  Provides Zoomed View of Specific Part of a Product i.e., Shirt Collar, Sleeves, etc.
  
* [Auto Alignment Change](#)  
  To View Back and Front Details.
  
* [Summary](#)  
  Provides Summary of your customised product and its details.	

* [Save and load favourite look](#)  
  Allows user to Save and custom product look.

  [View online Demo](http://www.textronic.online/tailori)

__________________________________________________________________________________________________________________________________

# Dependencies

i)  jquery.js   [download](https://code.jquery.com)

ii)  jsrender.js   [download](https://www.jsviews.com/download/jsrender.min.js) 

iii) jquery.tds.js [download](https://github.com/Sagar-TDS/Tailori-Plugin/archive/master.zip) 


# Templates
  ##  Binding Element Attributes  
  In addition to the normal text, you may also want your templates to contain HTML elements whose attributes are bound to the
  controller.  
	
	
	
	  <html>
	  <head>	
	  <script id="myTemplate" type="text/x-jsrender">Name: {{:name}}</script>
	  <head/>

	  Binding template "myTemplate" in html body will show result 

	  <body>
	   <div id="myTemplate">In this Id your all var data will call     
	   </div>   
	  </body>
	  

# Documentation

## Properties
| Props                                          | Description  | Required
| -----------------------------------------------|------------| -------:|
| ServiceUrl                                     | ServiceUrl is a url where we place all our data that we need to call, <br />For eg. product, draping parts, buttons, fabrics, etc. <br />**Provided by textronics.**  | * |
| Key                                    | Unique id generated when user logs in with given username and password <br>**Provided by textronics.** </br> | * |			
| Product                                        | Product Name <br /> For eg. 'Product':'MEN-SHIRT'| * | 
| ProductTemplate                                | jsrender template for rendering options/elements.<br />Create a Template id, when we call template id, template will open in page.<br />For eg. 'Product Template':#div-1 | * |
| ImageSource                                    | Image container where rendered images are placed (i.e. id, class or etc).<br /> Keep this empty if you want it to manage rendered image by its own.<br />For eg. 'Product Template': #img-div |         |
| OptionsPlace                                   | Container for placing the ProductOptions<br />For eg. ``` <html>    <div id ="ABC">product options will appear here </div>    </html>```<br />Here in html, we call id="ABC" so, all the features will be called in ABC.| * <sup><sup>1</sup></sup> |         
| OptionTemplate                                 | OptionTemplate is Created to display Product Options in the browser.<br />For displaying dynamically give template id of option here(it will render html contains dynamically when clicked on **Product** i.e. click collar or cuff, etc.)<br />For eg. 'optionTemplate':'#optiontemplatename' | * <sup><sup>1</sup></sup> |
| FeaturesPlace                                   | Container for placing the ProductOptions Feature<br /> For eg. 'featurePlace':'#xyz' | * <sup><sup>2</sup></sup> |         
| FeatureTemplate                                 | FeatureTemplate is Created to display Product Features in the browser.<br />For eg. 'featureTemplate':'#Featuretemplatename'| * <sup><sup>2</sup></sup> |
| IsOptionVisible                                 | If *true* Options such as straight cuff, beveled cuff, etc. will be displayed seperately,<br />If *false* Options and Features will be listed in same place.<br />For eg. 'Isoptions':'true'    |         |
| MonogramTemplate                               | Container for placing the Monogram Options.<br />In MonogramTemplate we can add: font, text, and placing area to show monogram,etc.| * <sup><sup>3</sup></sup> |
| MonogramPlace                               | Placing area to show Monogram on the apparel.<br />| * <sup><sup>3</sup></sup> |
| AutoSpecific                                   | If *true* Zoomed view of specific part is automatically rendered *else* not.|         |
| AutoAlignment                                  | Auto Alignment is the option for Front View and Back View.Boolean values "true" or "false" is used to change the view.<br />For eg. 'AutoAlignment':false, |         |
| AutoThread                                  | If we want to change button hole and button thread as per button color then set to *true* otherwise set *false*, by default it is *true* | 	|
| ImageSize                                | ImageSize is the option for specifying Image size.</br> If height & width is specified in #img_div container than it will automatically take containers height.</br> If not, By default the height= 1000px, and width= Auto. To change image size user can manually change it as per requirement. </br> For eg. 'ImageSize':'1000', </br>Or If you want to get original size of image then use 'ImageSize':'original' (o / original / auto)|         |


**Note:**     
*: Required.<br/>
*<sup><sup>1</sup></sup>: Properties marked as *<sup><sup>1</sup></sup> are dependent on each other.<br/>
*<sup><sup>2</sup></sup>: Properties marked as *<sup><sup>2</sup></sup> are dependent on each other.<br/>
	
## Data Attributes
| Data Attribute       | Description                                                    |
| ---------------------|:--------------------------------------------------------------|
| data-tds-alignment   | Possible values are "next"/"previous" and  alignment Name |
| data-tds-moption   | if value is ***text*** it used for input box for accepting input text for monogram |
|			| if value is ***preview*** it used for img tag for displaying priview of monogram |


## Callbacks
| Callback             | Description                                                    
| ---------------------|:--------------------------------------------------------------|
| OnProductChange      | This callback fires when user clicks on Product i.e. Shirt, Suit, etc. and this callback has one parameter i.e id of Product |
| OnProductDetailChange| This callback fires when user clicks on Product Details i.e. Coller, Cuff, Sleeves, etc and this callback has one parameter i.e id of Product Detail |
| OnOptionChange       | This callback fires when user clicks on ProductOptions i.e. High Coller, Low Coller, etc and this callback has one parameter i.e id of ProductOption  |
| OnFeatureChange      | This callback fires when user clicks on ProductOptions Feature i.e. Half Sleeve, Full Sleeve etc and this callback has one parameter i.e id of ProductOptions Feaure |
| OnContrastChange     | This callback fires when user clicks on Contrast  |
| OnRenderImageChange      | This callback fires when rendered images are ready to display i.e. after changing the element when we get result from textronics api, also, this callback has one parameter which array type <br />(*if you want to render image by yourself then use this parameter and then there no need to give <b>ImageSource</b> option in plugin initialization* ) |
| OnLibConfigChange     | This callback fires when user clicks on LibConfig Option i.e. button,tie etc.  |

# Public methods in plugin


To create Tailori object public methods are used.

```js    
    obj = $("#div-1").tailori({
			'Product':'MEN-SHIRT',   //Product i.e men shirt,women shirt, men suit, etc
			'ProductTemplate':'#theTmpl', //Template id for Product
			'ImageSource':'#img-div', //Container Id for place images
			'ServiceUrl':'http://172.16.1.63',
			'Key' : "12345678"
     });
      
```
------------------------------------------------
### `Product()`
If you want to change the **product** i.e from men-shirt to men-suit use 

```js
  obj.Product("men-suit");
```
------------------------------------------------
### `Texture()`
Get and Set the Texture (i.e.  fabric or color )  to apparel use 

if you want to apply fabric from textronics fabric library send id of fabric
```js
  obj.Texture("fab12589");
```

if you want to apply color as texture 
```js
  obj.Texture("red"); 
  obj.Texture("#ff0000");  //hex value of color
  obj.Texture("rgb(255,0,0)");  //rgb value of color
  obj.Texture("hsl(0, 100%, 50%)");  //hsl value of color
```

if you want texture of apparel call method without passing parameter

```js
 texture = obj.Texture();
```
------------------------------------------------

### `ContrastTexture()`
Get and Set the Texture (i.e.  fabric or color )  to contrast part of apparel 

if you want apply fabric from textronics fabric library send id of fabric
```js
  obj.ContrastTexture("fab12589");
```

if you want to apply color as texture 
```js
  obj.ContrastTexture("red"); 
  obj.ContrastTexture("#ff0000");  //hex value of color
  obj.ContrastTexture("rgb(255,0,0)");  //rgb value of color
  obj.ContrastTexture("hsl(0, 100%, 50%)");  //hsl value of color
```

if you want texture of contrast of apparel call method without passing parameter

```js
 contrasttexture = obj.ContrastTexture();
```

##### *Note: ContrastTexture applies texture only on last selected contrast*
------------------------------------------------

### `LibConfigTexture()`
Get and Set the Texture (i.e.  fabric or color )  to LibConfig (button,tie,shirt etc.) part of apparel 

if you want apply fabric from textronics fabric library send id of fabric
```js
  obj.LibConfigTexture("fab12589");
```

if you want to apply color as texture 
```js
  obj.LibConfigTexture("red"); 
  obj.LibConfigTexture("#ff0000");  //hex value of color
  obj.LibConfigTexture("rgb(255,0,0)");  //rgb value of color
  obj.LibConfigTexture("hsl(0, 100%, 50%)");  //hsl value of color
```

##### *Note: LibConfigTexture applies texture only on last selected LibConfig feature*
------------------------------------------------

### `SpecificDetails()`
To show specific details of a part, pass id as the parameter. This function will give you an array of name and id.

```js
obj.SpecificDetails();
```
---------------------------------------------------------------------------

### `SpecificRender()`
To specifically render an image, pass any one parameters from the three given below for desired view of the part: 

<ul>
<li>detail id   -     To show specific view of any product detail.</li>
<li>true        -	  To show last selected specific view.</li>
<li>false       -	  To show normal view i.e., model or full view.</li>
</ul>

```js
obj.SpecificRender(true);
```
---------------------------------------------------------------------------

### `Summary()`
To get the summary of apparel
Method returns the object contents i.e., selected part and fabric information with cost.
```js
obj.Summary();
```
-----------------------------------------------------------

### `ResetContrast()`
To reset all contrasts of apparels.
```js
obj.ResetContrast();
```

### `ResetProduct()`
To load default apparels. 
```js
obj.ResetProduct();
```

### `Look()`
To get and set your favourite look (*i.e. if you want to save your customized apparel for future use*)<br />
This will return you object which contain ***data*** and ***Image*** <br/>
If you want to load your look next time send ***data***  to the method. 


Get Look
```js
look = obj.Look();
// look.Data - to load save look next time
// look.Image - To show image of custmize look
```

Load Look
```js
 obj.Look(look.Data);
```

### `Options()`
Gets an item of particular product by sending it the product-id which you will get from OnProductChange.
It will return array of objects.

```js
optionsObj = obj.Options("158294");
```

### `Features()`
Get an items of particular product by sending it the option-id which you will get from OnOptionChange.
It will return array of objects.

```js
featuresObj = obj.Features("75321598");
```

### `Contrasts()`
Gets an item of particular product by sending it the product-id which you will get from OnProductChange.
It will return array of objects.

```js
contrastsObj = obj.Contrasts("158294");
```

------------------------------------------------
# Example

Using Tailori Plugin

```js    
    <script>
var obj =null;
function GetSummary(){
	console.log( obj.Summary());
}
function GetProduct(){
	obj.Product($("#product-info").val());
}
	$(document).ready(function () {
		//alert("hi")		
		
		 obj = $("#div-1").tailori(
		{
			'Product':'MEN-SHIRT',   //Product i.e men shirt,women shirt, men suit, etc
			'ProductTemplate':'#theTmpl', //Tempalte id for Product
			'ImageSource':'#img-div', //Container Id for place images
			'ServiceUrl':'http://172.16.1.63',
			'Key' : "12345678",
			'AutoSpecific':false, //Auto specific view after selecting any feature
			'AutoAlignment':false, //Auto alignment set according to selected element
			'Monogram':false, //If monogram 
			'MonogramTemplate':'#theTmplm', //Tempalte id for Monogram UI
			'MonogramPlace':'#monoplace', // html containter for Monogram
			'OnFeatureChange': function(){
				alert($(this).attr("data-tds-key"));
				
				console.log(abc);				
			},
			'OnRenderImageChange':function(a){
				console.log(a);
				//console.log(b);
			}
			
		});
		
	});
   </script>
```


_______________________________________________________________________________

# How to use JsRender and Creating Template
JsRender is a light-weight but powerful templating engine.
	   
## Define a template	
From a template declared as markup in a script block:

<code><script id="myTemplate" type="text/x-jsrender">Name: {{:name}}</script></code>    
    
But now we are using for textronics tailori, so we will use {{for ...}} tag
Following object hierarchy is provided to you for creating templates.
<pre>
├──── Product
│   │
│   ├──── Options 
│   │   │
│   │   └── Features
│   │
│   └──── Contrasts
│
├──── MonogramPlacement
│
├──── MonogramFont
│
└──── MonogramColor</pre>

Following is an object structure of Product, Options, Features, Contrasts, MonogramPlacement, MonogramFont and MonogramColor which will be used for more detailing of your template:
<pre>
 Product/ Options/ Features/ Contrasts/ MonogramPlacement/ MonogramFont/ MonogramColor
    │
    ├── Id 
    ├── Name
    └── ImageSource
</pre>


A template (with a conditional section using an {{for}}-------{{for}}, tag):

 ##### In Example
Products we are using{{for product}}-------{{for}}  
Options we are using{{for options}}-----{{for}}  
Contast we are using{{for contrast}}-----{{for}} 

## Example of template for bootstrap accordion 

```html
<script id="theTmpl" type="text/x-jsrender">
		
<div class="panel-group" id="accordion2">
{{for Product}}
<div class="panel panel-default">
	<div class="panel-heading">
	<h4 class="panel-title">
	<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" 
							    href="#collapse{{:Id}}">
	<img style="max-width:30px;" src="{{:ImageSource}}">{{:Name}}
	</a>
	</h4>
</div>
<div id="collapse{{:Id}}" class="panel-collapse collapse">
	<div class="panel-body">
	<table class="table">
	{{for Options}}
						
	{{for Features}}		
		<tr id="{{:Id}}">
			<td><span class="glyphicon glyphicon-chevron-right"></span>
			<a href="#">{{:Name}}</a>
			</td>
		</tr>
		{{/for}}
		{{/for}}
		{{for Contrasts}}		
		<tr id="{{:Id}}">
			<td><span class="glyphicon glyphicon-chevron-right"></span>
			 <a href="#">{{:Name}}</a>
			</td>
		</tr>
	{{/for}}
	</table>
	</div>
</div>
</div>
{{/for}}
</div>

</script>
```
_______________________________________________________________________________

## Example of template for bootstrap nav panel 

```html
<script id="theTmpl1" type="text/x-jsrender">
<div class="col-md-12">
<div class="panel with-nav-tabs panel-default">
  <div class="panel-heading">
	<ul class="nav nav-tabs">
		{{for Product}}                            
	<li><a href="#tab{{:Id}}" data-toggle="tab">
	<img style="max-width:30px;" src="{{:ImageSource}}">{{:Name}}</a>
		</li>                          
		{{/for}}   
	</ul>
   </div>
   <div class="panel-body">
       <div class="tab-content">
	{{for Product}}					
        <div class="tab-pane fade " id="tab{{:Id}}">
	<ul class="list-group">
		{{for Options}}
		  {{for Features}}
	<li class="list-group-item" id="{{:Id}}">{{:Name}}</li>						
		  {{/for}}   
		{{/for}}   
	</ul>
	</div>
	{{/for}}                           
	</div>
  </div>
</div>
</div>	
</script>
```
_______________________________________________________________________________

If you want to show options and feature dynamically, you can create three template
 
1. For Product
2. For Option
3. For Feature

if *IsOptionVisible=false*  or Product contains only one option then it will directly show  all the features from particular Product

### Example for Product Template


```html
<script id="theTmpl33" type="text/x-jsrender">
	<li id="Fab">
	<a><span>Fabrics</span></a>
	</li>
	{{for Product}}
	<li>
	<a class="nav-toggle" href="#" style="background-image:url({{:ImageSource}}); 
	                                               background-repeat:no-repeat;">
	<span>{{:Name}}</span>
	</a>
	</li>
	 {{/for}}
	<li id="Monogram">
	 <a><span>Monogram</span></a>
	</li>
 </script>
```
___________________________________________________________________________

### Example for Option Template

```html
<script id="optionsTemplate" type="text/x-jsrender">
 {{for Options}}
	<li id='{{:Id}}'>
	<a class='nav-toggle' href='#' style='background-image:url({{:ImageSource}}); 
						       background-repeat:no-repeat;'>
	<span>{{:Name}}</span>
	</a>
	</li>
{{/for}}
 </script>
```
____________________________________________________________________

### Example for Feature Template

```html

<script id="FeaturesTemplate" type="text/x-jsrender">
{{for Features}}
 	<li>
 	<a href="#" style="background-image:url({{:ImagesUrl}}); background-repeat:no-repeat;
								      background-size:100%;">
 	<span>{{:Name}}</span>
	 </a>
	</li>
 {{/for}}
</script> 
```

_______________________________________________________________________________

## Monogram

### Example for Monogram Template

```html
<script id="MonogramTemplate2" type="text/x-jsrender">
<div class="form-group">
	<label for="sel1">Monogram Placement:</label>
	<select class="form-control" id="sel1">
	  {{for MonogramPlacement}}
	  <option>{{:Name}}</option>
	    {{/for}}
	</select>
</div>
<div class="form-group">
	<label for="sel2">Monogram Font:</label>
	<select class="form-control" id="sel2">
	   {{for MonogramFont}}
	   <option>{{:Name}}</option>
	   {{/for}}
	</select>
</div>
<div class="form-group">
	<label for="usr">Monogram Text:</label>
	<input class="form-control" id="monogram-text" data-tds-moption="text" 
	                                 placeholder="Enter Text" type="text">
</div>
<div>
	<label>Monogram Color:</label>
	<ul class="color">
	    {{for MonogramColor}}
	    <li style="background-color:{{:Name}};">
	    <a href="#" style="background-color:{{:Name}}; background-repeat:no-repeat; 
	                                                         background-size:100%;">
	    </a>
	    </li>
	    {{/for}}
	</ul>
</div>
</script>

```



