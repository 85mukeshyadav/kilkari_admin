jQuery(document).ready(function() {
    console.log('product-details page added script_tag1');
    var skuId = $("#sku_id").val();
    if(parseInt(skuId)>0){
        var url = "https://bridge.lenskart.com/api/getProductDetails/"+skuId;
        console.log(url);
        $.ajax({
            url: url,
            success: function(data) {
                if (typeof data !== "undefined") {
                    //console.log(data);
                    //================= Slider ==================================//
                    var imageCollection = data.imageUrlsDetail;
                    var sliderLiElement = '';
                    var rightBottomImgUrl ='';
                    $.each(imageCollection, function( imgIndex, imageData ) {
                        //alert( imgIndex + ": " + imageData );
                        // if(value.name == 'Frame Dimensions'){
                        //     frameDimensions = value.value;
                        // }
                        if(imageData.label== 'Image_Left'){
                            rightBottomImgUrl = imageData.url;
                        }
                        //console.log(imageData);
                        //sliderLiElement += '<li class="id_'+imageData._id+' lslide" data-index="'+imgIndex+'" data-thumb="//cdn.shopify.com/s/files/1/0047/5335/8922/products/vincent-chase-vc-e11891-rectangle-half-rim-c2-eyeglasses_xx_23df6087-3102-4116-8a1a-ca66ab83232c_small.jpg?v=1614736453" data-src="//cdn.shopify.com/s/files/1/0047/5335/8922/products/vincent-chase-vc-e11891-rectangle-half-rim-c2-eyeglasses_xx_23df6087-3102-4116-8a1a-ca66ab83232c_grande.jpg?v=1614736453" style="width: 769px; margin-right: 0px;"><div class="">';
                        sliderLiElement += '<li><img src="'+imageData.url+'" /></li>';
                        //sliderLiElement += '</div></li>';
                    });
                    console.log(sliderLiElement);
                    $('#ProductImages').html(sliderLiElement);
                    //===========================================================//
                    //================= Frame Details ===========================//
                    var frameDetail = data.specifications[0].items;
                    //console.log(frameDetail);
                    //var data = JSON.parse(res);
                    var frameDimensions ='';
                    var frameDetailsHtml = '<table class="discription-lk discription-lk1">';
                    frameDetailsHtml += '<tbody>';
                    $.each(frameDetail, function( index, value ) {
                        //alert( index + ": " + value );
                        if(value.name == 'Frame Dimensions'){
                            frameDimensions = value.value;
                        }
                        //console.log(value);
                        frameDetailsHtml += '<tr>';
                        frameDetailsHtml += '<td class="one">'+value.name+'</td>';
                        frameDetailsHtml += '<td class="two">'+value.value+'</td>';
                        frameDetailsHtml += '</tr>';
                    });
                    frameDetailsHtml += '</tbody>';
                    frameDetailsHtml += '</table>';
                    $('#product_fram_details').html(frameDetailsHtml);
                    //===========================================================//
                    if(frameDimensions !=''){
                        frameDimensionArr = frameDimensions.split("-");
                        var frameDiamentionsHtml = '<div class="row text-center measurementsize"><h4 class="">MEASUREMENTS</h4>';
                        frameDiamentionsHtml += '<div class="col-xs-12 col-sm-4 col-md-4"><img src="https://static.lenskart.com/media/desktop/img/1st_frame.jpg" alt="">';
                        frameDiamentionsHtml += '<div class="size-text">'+frameDimensionArr[0]+' mm</div>';
                        frameDiamentionsHtml += '</div><div class="col-xs-12 col-sm-4 col-md-4"><img src="https://static1.lenskart.com/media/desktop/img/2nd_frame.jpg" alt="">';
                        frameDiamentionsHtml += '<div class="size-text">'+frameDimensionArr[1]+' mm</div>';
                        frameDiamentionsHtml += '</div><br/><div class="col-xs-12 col-sm-4 col-md-4"><img src="https://static2.lenskart.com/media/desktop/img/3rd_frame.jpg" alt="">';
                        frameDiamentionsHtml += '<div class="size-text">'+frameDimensionArr[2]+' mm</div>';
                        frameDiamentionsHtml += '</div></div>';
                        $('#frame_dimensions_panel').html(frameDiamentionsHtml);
                    }
                    if(rightBottomImgUrl !=''){
                        var rightImgElement = '<img alt="Lenskart Air Black Rectangle Eyeglasses - 130186" sizes="799px" class="img_blur blur-up lazyautosizes lazyloaded" data-sizes="auto" src="'+rightBottomImgUrl+'" data-src="'+rightBottomImgUrl+'" data-srcset="'+rightBottomImgUrl+'" srcset="'+rightBottomImgUrl+'">';
                        $("#rightBottumImg").html(rightImgElement);
                    }
                }

            },
            type: 'GET'
        });
    }
    //$("#script-tag1").html('<div class="row detailstablerow"><div class="col-md-12 col-sm-12 col-xs-12 detailscol"><table class="discription-lk discription-lk1"><tbody><tr><td class="one">Frame Size:</td><td class="two">Small</td></tr><tr><td class="one">Frame Width:</td><td class="two">131 mm</td></tr><tr><td class="one">Frame Dimensions:</td><td class="two">52-16-140</td></tr><tr><td class="one">Frame colour:</td><td class="two">Blue</td></tr><tr><td class="one">Weight:</td><td class="two">24 gm</td></tr><tr><td class="one">Frame Material:</td><td class="two">Acetate</td></tr><tr><td class="one">Temple Material:</td><td class="two">Acetate</td></tr><tr><td class="one">Gender:</td><td class="two">Unisex</td></tr><tr><td class="one">Height:</td><td class="two">37 mm</td></tr></tbody></table></div></div>');
});