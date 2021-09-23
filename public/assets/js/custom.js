jQuery(document).ready(function ($) {
  "use strict";

  $("input[name='ukupna_cijena']").hide();
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  $("#odDatuma").attr("min", today);
  $("#doDatuma").attr("min", today);

  $("#doDatuma").change(function () {
    const date1 = new Date($("#doDatuma").val());
    const date2 = new Date($("#odDatuma").val());

    const diffTime = Math.abs(date2 - date1);
    let brojDana = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(brojDana + " days");
    brojDana = brojDana * 20;
    if (brojDana) {
      $(".ukupna_cijena").html(brojDana + " KM");
      $(function () {
        $("input[name='ukupna_cijena']").val(brojDana);
      });
    }
  });
  /////////////////////////////////////////////////

  $(document).ready(function () {
    load_data();
    function load_data(query) {
      $.ajax({
        url: "/trazi",
        method: "post",
        data: { query: query },
        success: function (data) {
          // $("tbody").empty();
          $(".product-item").empty();
          data.forEach((p, i) => {
            console.log(i);
            $(".product-item").append(`
           
              <img src="/public/${p.images}"  alt="slika">
                <div class="down-content">
                    <h4>Lokacija: ${p.id_lokacija.grad}> </h4>
                    <h7>Dimenzije: ${p.dimenzija} </h7><br>
                    <h7>Cijena : ${p.pocetna_cijena}> </h7><br>
                    <h7>Broj slobodnih mjesta:  ${p.brojMjesta} </h7><br><br>
                    <p>Opis: ${p.opis}> </p>
                  <a href="/panel/${p._id}">
                      <button class="button">Rezerviraj</button>
                    </a>
                </div>
          `);

            /* $("tbody").append(
              `<tr><td>${p.id_lokacija.grad}</td><td>${p.dimenzija}</td></tr>`
            );*/
          });
        },
      });
    }
    $("#search_text").keyup(function () {
      var search = $(this).val();
      if (search != "") {
        load_data(search);
      } else {
        $.ajax({
          type: "GET",
          url: "/",
          success: (response) => {
            window.location = "/";
          },
          error: (e) => {
            alert("error!");
          },
        });
      }
    });
  });

  // Get the modal
  var modal = document.getElementById("id01");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  /////////////////////////////////

  $(function () {
    $("#tabs").tabs();
  });

  // Page loading animation

  $("#preloader").animate(
    {
      opacity: "0",
    },
    600,
    function () {
      setTimeout(function () {
        $("#preloader").css("visibility", "hidden").fadeOut();
      }, 300);
    }
  );

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var box = $(".header-text").height();
    var header = $("header").height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });
  if ($(".owl-clients").length) {
    $(".owl-clients").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      items: 1,
      margin: 30,
      autoplay: false,
      smartSpeed: 700,
      autoplayTimeout: 6000,
      responsive: {
        0: {
          items: 1,
          margin: 0,
        },
        460: {
          items: 1,
          margin: 0,
        },
        576: {
          items: 3,
          margin: 20,
        },
        992: {
          items: 5,
          margin: 30,
        },
      },
    });
  }
  if ($(".owl-testimonials").length) {
    $(".owl-testimonials").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      items: 1,
      margin: 30,
      autoplay: false,
      smartSpeed: 700,
      autoplayTimeout: 6000,
      responsive: {
        0: {
          items: 1,
          margin: 0,
        },
        460: {
          items: 1,
          margin: 0,
        },
        576: {
          items: 2,
          margin: 20,
        },
        992: {
          items: 2,
          margin: 30,
        },
      },
    });
  }
  if ($(".owl-banner").length) {
    $(".owl-banner").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      items: 1,
      margin: 0,
      autoplay: false,
      smartSpeed: 700,
      autoplayTimeout: 6000,
      responsive: {
        0: {
          items: 1,
          margin: 0,
        },
        460: {
          items: 1,
          margin: 0,
        },
        576: {
          items: 1,
          margin: 20,
        },
        992: {
          items: 1,
          margin: 30,
        },
      },
    });
  }

  $(".Modern-Slider").slick({
    autoplay: true,
    autoplaySpeed: 10000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    dots: true,
    pauseOnDotsHover: true,
    cssEase: "linear",
    // fade:true,
    draggable: false,
    prevArrow: '<button class="PrevArrow"></button>',
    nextArrow: '<button class="NextArrow"></button>',
  });

  $(".filters ul li").click(function () {
    $(".filters ul li").removeClass("active");
    $(this).addClass("active");

    var data = $(this).attr("data-filter");
    $grid.isotope({
      filter: data,
    });
  });

  var $grid = $(".grid").isotope({
    itemSelector: ".all",
    percentPosition: true,
    masonry: {
      columnWidth: ".all",
    },
  });
  $(".accordion > li:eq(0) a").addClass("active").next().slideDown();

  $(".accordion a").click(function (j) {
    var dropDown = $(this).closest("li").find(".content");

    $(this).closest(".accordion").find(".content").not(dropDown).slideUp();

    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
    } else {
      $(this).closest(".accordion").find("a.active").removeClass("active");
      $(this).addClass("active");
    }

    dropDown.stop(false, true).slideToggle();

    j.preventDefault();
  });
});
