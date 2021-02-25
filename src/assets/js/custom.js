 
         jQuery(function ($) {
         
             $(".sidebar-dropdown > a").click(function() {
           $(".sidebar-submenu").slideUp(200);
           if (
             $(this)
               .parent()
               .hasClass("active")
           ) {
             $(".sidebar-dropdown").removeClass("active");
             $(this)
               .parent()
               .removeClass("active");
           } else {
             $(".sidebar-dropdown").removeClass("active");
             $(this)
               .next(".sidebar-submenu")
               .slideDown(200);
             $(this)
               .parent()
               .addClass("active");
           }
         });
         
            
         });
		 
		 
      
         function openNav() {
           document.getElementById("mySidenav").style.width = "70%";
         }
         
         function closeNav() {
           document.getElementById("mySidenav").style.width = "0";
         }
         
		 
		 
         jQuery(function($) {
         $(document).ready(function(){
         $("#toggled").click(function(e){
         e.stopPropagation();
         $("body").addClass("overlay-menu");
         
         });
         $(".closebtn").click(function(){
         $("body").removeClass("overlay-menu");
         console.log('body')
         });
         $(".overlay").click(function(){
         $("body").removeClass("overlay-menu");
         console.log('body')
         });
         });
         });
   
   
   
		jQuery(function($) {
         $(document).ready(function(){
         $("#user-dash").click(function(e){
         e.stopPropagation();
         $("body").addClass("dash-show");
         
         });
         $(".dashclose").click(function(){
         $("body").removeClass("dash-show");
         console.log('body')
         });

         });
         });



	function myFunction() {
	  var x = document.getElementById("min-stake");
	  if (x.style.display === "block") {
		x.style.display = "none";
	  } else {
		x.style.display = "block";
	  }
	}


/*this is for animation js*/

$("ul.nav-tabs a").click(function (e) {
  e.preventDefault();  
    $(this).tab('show');
});









$(document).ready(function(){
	$('.count').prop('disabled', true);
	$(document).on('click','.plus',function(){
		$('.count').val(parseInt($('.count').val()) + 1 );
	});
	$(document).on('click','.minus',function(){
		$('.count').val(parseInt($('.count').val()) - 1 );
			if ($('.count').val() == 0) {
				$('.count').val(1);
			}
		});
});





$(document).ready(function(){
    $(".accordion-title").click(function(e){
        var accordionitem = $(this).attr("data-tab");
        $("#"+accordionitem).slideToggle().parent().siblings().find(".accordion-content").slideUp();

        $(this).toggleClass("active-title");
        $("#"+accordionitem).parent().siblings().find(".accordion-title").removeClass("active-title");

        $("i.fa-chevron-down",this).toggleClass("chevron-top");
        $("#"+accordionitem).parent().siblings().find(".accordion-title i.fa-chevron-down").removeClass("chevron-top");
    });
    
});





