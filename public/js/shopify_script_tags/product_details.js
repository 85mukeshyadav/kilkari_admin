jQuery(document).ready(function() {
    console.log('my product-details test');
    var skuId = $("#sku_id").val();
    //alert(window.location.port);
    var hostname = window.location.hostname;
    var port = window.location.port;
    var baseUrl = "http://";
    var portStr = ":3000";
    if(hostname){
        baseUrl += hostname;
    }else{
        baseUrl += "localhost";
    }
    if(port){
        baseUrl += ':'+port;
    }else{
        baseUrl += portStr;
    }
    baseUrl = "https://bridge.lenskart.com";
    if(parseInt(skuId)>0){
        
        var apiUrl = baseUrl+"/api/getProductDetails/"+skuId;
        $.ajax({
            url: apiUrl,
            success: function(data) {
                if (typeof data !== "undefined") {
                    var imageUrlsDetail = data.imageUrlsDetail;
                    var specifications = data.specifications[0].items;
                    var productType = data.type;
                    var prescriptionType = data.prescriptionType;
                    var title = data.fullName.value;
                    // ================= Show Frame Detail Start From Here ===================//
                    var specificationToshowList = ["Frame Size", "Frame Width", "Frame Dimensions", "Frame colour", "Weight", "Frame Material", "Temple Material", "Gender", "Height"];
                    var framedimensions = '';
                    var prdDetailStr ="<div class='row detailstablerow'><div class='col-md-12 col-sm-12 col-xs-12 detailscol'>"
                    prdDetailStr += "<table class='discription-lk discription-lk1'><tbody>";
                    var gender ='';
                    $.each(specifications, function( index, val ) {
                        if ( $.inArray(val.name, specificationToshowList) > -1) {
                            if(val.name == 'Frame Dimensions'){
                                framedimensions = val.value;
                            }
                            if(val.name == 'Gender'){
                                gender = val.value;
                            }

                            prdDetailStr += "<tr><td class='one'>"+val.name+":</td><td class='two'>"+val.value+"</td></tr>";
                        }
                    });
                    prdDetailStr += "</tbody></div></div>";
                    $('.lk-frame-details h4').after(prdDetailStr);
                    $('.skeleton-line').hide();
                    // ================= Show Frame Detail End Here ===================//

                    //=================== Frame Dimensions Start From Here ================ //
                    var count = 0;
                    var res = framedimensions.split("-");
                    $('.measurementsize .col-xs-12').each(function(){
                        if(count > 2){ count = 0;}
                        if($(this).find('.size-text').length > 0){
                            $(this).find('.size-text').text(res[count]+ ' mm');
                        }else{
                            $(this).find('img').after("<div class='size-text'>"+res[count]+" mm</div>");
                        }
                        count++;
                    });
                    // ============ Frame Dimensions End From Here ================ //

                    // ============ Show caraousal Image and FRAMES IN ACTION image for men and women ==============//
                    var leftImgUrl = '';
                    //console.log(title);
                    gender = gender.toLowerCase();
                    productType = productType.toLowerCase();
                    var sliderLiElement ='';
                    //console.log(gender);
                    //var simply = {};
                    var srcSetStr ='';
                    $.each(imageUrlsDetail, function(key, value) {

                        if(value.label.includes('Image_Left')){
                            leftImgUrl = value.url;
                        }
                        sliderLiElement += '<li class="id_'+value._id+'" lslide active"  data-index="'+key+'"';
                        sliderLiElement +=' data-thumb="'+value.url+'" style="width: 769px; margin-right: 0px;">';
                        sliderLiElement +=' <div class="">';
                        sliderLiElement +=' <img src="'+value.url+'"';
                        sliderLiElement +=' data-img="'+value.url+'"';
                        sliderLiElement +=' data-img-xs="'+value.url+'"';
                        sliderLiElement +=' class="product_image img_blur img_load"';
                        sliderLiElement +=' alt="'+title+'"';
                        sliderLiElement +=' title="'+title+'" />';
                        sliderLiElement +=' </div>';
                        sliderLiElement +=' </li>';


                        srcSetStr += value.url+' ';
                        var mobileimage = value.url.replace('628x301', '1325x636');
                            
                        $('#ProductImages').append('<li><div class="zoom img"><img class="product_image img_blur img_load" src="'+mobileimage+'" alt="" /></div></li>');
                       
                        
                        
                        if(productType == "sunglasses")
                        {
                        
                            if(value.label=="Image_FT"!='' || value.label=="Image_MT" !='')
                            {

                                if(gender == 'men')
                                {
                                    if(value.label=="Image_FT" !='')
                                    {
                                        $('.desk_gellery .desk_woman').prepend('<img class="mySlides" src="'+ mobileimage+'" alt="" />');
                                        simply.women_yes = 'true';
                                    }else if(value.label=="Image_MT" !='')
                                    {
                                        $('.desk_gellery .desk_man').prepend('<img class="mySlides" src="'+mobileimage+'" alt="" />');
                                        simply.men_yes = 'true';
                                    }
                                }elseif(gender == 'women')
                                {
                                    if(value.label=="Image_FT"!='')
                                    {
                                        $('.desk_gellery .desk_woman').prepend('<img class="mySlides" src="'+mobileimage+'" alt="" />');
                                        simply.women_yes = 'true';
                                    }
                                    elseif(value.label=="Image_MT"!='')
                                    {
                                        $('.desk_gellery .desk_man').prepend('<img class="mySlides" src="'+mobileimage+'" alt="" />');
                                        simply.men_yes = 'true';
                                    }
                                }
                            }
                        
                        
                        } 
                        else
                        {
                            if(value.label=="Image_FT"!='' || value.label=="Image_MT"!='')
                            {
                                if(value.label=="Image_FT"!='')
                                {
                                    $('.desk_gellery .desk_woman').prepend('<img class="mySlides" src="'+mobileimage+'" alt="" />');
                                    simply.women_yes = 'true';
                                }else if(value.label=="Image_MT"!='')
                                {
                                    $('.desk_gellery .desk_man').prepend('<img class="mySlides" src="'+mobileimage+'" alt="" />');
                                    simply.men_yes = 'true';
                                }
                            }
                        }
                        
                        var htmlformoredet = "";
                        if(productType != 'sunglasses'){
                            htmlformoredet += "<div>";
                            htmlformoredet += "<span>Prescription Type : </span>";
                            $.each(prescriptionType, function( index, val ) {
                                htmlformoredet += '<ul>';
                                if(val.isPackageAvailable == true){
                                htmlformoredet += "<li>"+val.title+"</li>";
                                }
                                htmlformoredet += '</ul>';
                            });
                            htmlformoredet += "<span>Lens Type : </span>";
                            $.each(prescriptionType, function( index, val ) {
                                htmlformoredet += '<ul>';
                                if(val.isPackageAvailable == true){
                                htmlformoredet += "<li>"+val.title+"</li>";
                                }
                                htmlformoredet += '</ul>';
                            });
                            htmlformoredet += "</div>";
                        }else{
                            htmlformoredet += "<div>";
                            htmlformoredet += "<span>Know Your Lenses!</span>";
                            htmlformoredet += "<ul>";
                            htmlformoredet += "<li> 1</li>";
                            htmlformoredet += "<li> 2</li>";
                            htmlformoredet += "<li> 3</li>";
                            htmlformoredet += "</ul>";
                            htmlformoredet += "</div>";
                        }

                        if(leftImgUrl == ''){
                            leftImgUrl = data.imageUrls[0];
                        }
                        htmlformoredet += "<div><img src='"+leftImgUrl+"'></div>";
                        $('.product-review-img').html(htmlformoredet);
                        $('.pp-gallery').show();
                    });
                    
                    
                    
                    if(leftImgUrl ===''){
                        leftImgUrl = data.imageUrls[0];
                    }
                    console.log("==== leftImgUrl ====");
                    console.log(leftImgUrl);
                    if(leftImgUrl !==''){
                        var rightImgElement = '<img alt="'+title+'" sizes="799px" class="img_blur blur-up lazyautosizes lazyloaded" data-sizes="auto" src="'+leftImgUrl+'"';
                        rightImgElement += ' data-src="'+leftImgUrl+'" ';
                        rightImgElement += ' data-srcset="'+leftImgUrl+'"'; 
                        rightImgElement += ' srcset="'+srcSetStr+'" />';

                        $(".iimmgg").html('<div class="img">'+rightImgElement+'</div>');
                    }
                    
                    //console.log("===================================================");
                   // console.log(sliderLiElement);
                    $('#ProductImages').append(sliderLiElement);
                    //console.log("===================================================");
                     simply.product_page_slider.refresh();

                    if(simply.men_yes == 'true' && simply.women_yes == 'true'){
                        $('.tabsdd').show();
                    }
                  
                    $(".desk_gellery #desk_man").owlCarousel({
                        items:1,
                        itemsDesktop:[1000,1],
                        itemsDesktopSmall:[979,1],
                        itemsTablet:[768,1],
                        pagination:false,
                        navigation:true,
                        navigationText:["",""],
                        autoPlay:false
                    });

                    $(".desk_gellery #desk_woman").owlCarousel({
                        items:1,
                        itemsDesktop:[1000,1],
                        itemsDesktopSmall:[979,1],
                        itemsTablet:[768,1],
                        pagination:false,
                        navigation:true,
                        navigationText:["",""],
                        autoPlay:false
                    });

                    
                    
                }else{
                    console.log('API not responding..');
                    console.log(data);
                }
              
            },
            type: 'GET'
        });
    }
    
});