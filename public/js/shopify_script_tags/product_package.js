function getpackage(){
    var skuId = parseInt($("#currentSku").val());
    if(skuId>0){
        var url = `https://bridge.lenskart.com/api/get_product_package/`+skuId 
        console.log(url);
        $.get(url, function(data){
            let resd = data;
            console.log(data);
            htmlPrepard(resd.data);
        });
    }else{
        console.log("Invalid SKU Id to get package");    
    }
}

function htmlPrepard(data){
  var masterPrice = $(".product-price").attr('data-price');
  masterPrice = parseInt(masterPrice);
  let biofocal = data.bifocal;
  let singlev = data.single_vision;
  var htmlData = '';
  htmlData += '<div class="productpage-wrap">';
  htmlData += '<ul>';
  if(singlev){
    htmlData += '<li class="first-li">';
    htmlData += '<div class="packagename">';
    htmlData += '<input type="hidden" name="lenstype" class="lens_input1" id="single-vision" value="Single Vision">';
    htmlData += '<label for="single-vision">Single Vision</label>';
    htmlData += '<p>For Far Objects</p>';
    htmlData += '</div>';
    htmlData += '<div class="package-info">';
    htmlData += '<p>Choose Lens Type</p>';
    htmlData += '<ul>';
    $.each(singlev, function(index, value ) {
      var singL = value.prices[1].price;
      singL = parseInt(singL)
      singL = singL * 100;
      totalPs = masterPrice + singL;
      console.log(totalPs +'totalPs')
      htmlData += '<li>';
      htmlData += '<div class="package-d" data-price="'+singL+'">';
      htmlData += '<input type="hidden" name="lenstype" class="lens_input1" id="'+value.id+'" value="'+value.name+'">';
      htmlData += '<label for="'+value.id+'">'+value.label+' <span>('+ Shopify.formatMoney(singL) +')</span></label> <i class="lensinfo"></i>';
      htmlData += '<p>(Frame + Lens) <span>'+ Shopify.formatMoney(totalPs) + '</span></p>';
      htmlData += '</div>';
      htmlData += '</li>';
    });
    htmlData += '</ul>';
    htmlData += '</div>';
    htmlData += '</li>';

  }
  if(biofocal){
    htmlData += '<li class="first-li second-li">';
    htmlData += '<div class="packagename">';
    htmlData += '<input type="hidden" name="lenstype" class="lens_input1" id="bifocal-power" value="Progressive / Bi-Focal">';
    htmlData += '<label for="bifocal-power">Progressive / Bi-Focal</label>';
    htmlData += '<p>For both Distance and Near Vision</p>';
    htmlData += '</div>';
    htmlData += '<div class="package-info">';
    htmlData += '<p>Choose Lens Type</p>';
    htmlData += '<ul>';
    $.each(biofocal, function(index, value ) {
      var bioL = value.prices[1].price;
      bioL = parseInt(bioL)
      bioL = bioL * 100;
      totalPb = masterPrice + bioL;
      //console.log(totalPb +'totalPb')
      htmlData += '<li>';
      htmlData += '<div class="package-d" data-price="'+bioL+'">';
      htmlData += '<input type="hidden" name="lenstype" class="lens_input1" id="'+value.id+'" value="'+value.name+'">';
      htmlData += '<label for="'+value.id+'">'+value.label+' <span>('+ Shopify.formatMoney(bioL) +')</span></label> <i class="lensinfo"></i>';
      htmlData += '<p>(Frame + Lens) <span>'+ Shopify.formatMoney(totalPb) +'</span></p>';
      htmlData += '</div>';
      htmlData += '</li>';
    });
    htmlData += '</ul>';
    htmlData += '</div>';
    htmlData += '</li>';
  }

  htmlData += '<li class="first-li third-li">';
  htmlData += '<div class="packagename">';
  htmlData += '<input type="hidden" name="lenstype" class="lens_input1" id="Frame-Only" value="Frame Only">';
  htmlData += '<label for="Frame-Only">Frame Only</label>';
  htmlData += '<p>Without any lenses</p>';
  htmlData += '</div>';
  htmlData += '</li>';


  htmlData += '</ul>';
  htmlData += '</div>';


  $(".lenspackageDe").html(htmlData);
}

$(document).ready(function(){
    console.log("=== GET PACKAGES FROM BRIDGE ===");
    getpackage();
});