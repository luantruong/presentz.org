//GENERAL BEHAVIORS
var Controls = {

    init: function() {
        Controls.resize();
        var $this = this;
        var $chapters = $("#controls .chapter");
        var totalChapters = $chapters.length;
        $chapters.each(function() {
            var $instance = $(this);
            $instance
                .unbind("mouseenter")
                .bind("mouseenter", function() {
                    var selectedChapterWidth = $("#controls").width() + 1 - (totalChapters * 2);

                    $chapters.not($instance).css("width", "2px");

                    $instance.css("width", selectedChapterWidth + "px");
                    $instance.find(".info").stop(true, true).delay(200).fadeIn(500);
                })
                .unbind("mouseleave")
                .bind("mouseleave", function() {
                    $this.restoreOriginalWidth();
                });

        });

        $("#controls .chapter .info .comments a")
            .unbind("click")
            .bind("click", function() {
                alert("SHOW COMMENT FOR THIS SLIDE!");
            });

        $("#controls .chapter .info .title a, #chapters ol li a")
            .unbind("click")
            .bind("click", function() {
                var $this = $(this);
                presentz.changeChapter(parseInt($this.attr("chapter_index")), parseInt($this.attr("slide_index")), true);
            });
    },

    restoreOriginalWidth: function() {
        $("#controls .chapter").each(function() {
            $(this).find(".info").stop(true, true).hide();
        });
        Controls.resize();
    },

    resize: function() {
        var container_width = $("#controls").width();
        var min_pixel_width = 2;
        var min_pixel_width_as_percentage = 100 * min_pixel_width / container_width;
        console.log([container_width, min_pixel_width, min_pixel_width_as_percentage]);
        var $chapters = $("#controls .chapter");
        var stolen_percentage = 0;
        var long_chapters_percentage = 0;
        $chapters.each(function() {
            var $chapter = $(this);
            var percentage = parseFloat($chapter.attr("percentage"));
            if (percentage < min_pixel_width_as_percentage) {
                stolen_percentage += (min_pixel_width_as_percentage - percentage);
                $chapter.attr("percentage", min_pixel_width_as_percentage);
            } else {
                long_chapters_percentage += percentage;
            }
        });
        var percentage_to_remove_from_long_chapters = 100 * stolen_percentage / long_chapters_percentage;
        console.log([stolen_percentage, long_chapters_percentage, percentage_to_remove_from_long_chapters]);
        $chapters.each(function() {
            var $chapter = $(this);
            var percentage = parseFloat($chapter.attr("percentage"));
            if (percentage > min_pixel_width_as_percentage) {
                console.log(["old perce", percentage, percentage_to_remove_from_long_chapters]);
                percentage -= (percentage / 100 * percentage_to_remove_from_long_chapters);
                console.log(["new perce", percentage]);
                $chapter.attr("percentage", percentage);
            }
        });

        
        var sum = 0;
        $chapters.each(function() {
            var $chapter = $(this);
            var percentage = parseFloat($chapter.attr("percentage"));
            sum += percentage;
            var px_width = container_width / 100 * percentage;
            $chapter.css("width", px_width + "px");
        });
        console.log(sum);
    }
};

var DemoScroller = {

    displayItemNumber: 3,
    itemNumber: 0,
    content_slider_w: null,

    init: function() {
        this.resize();

        this.itemNumber = $('#content_slider li.box4').length;
        if (this.itemNumber > this.displayItemNumber) {
            this.createNav();
        }
    },

    createNav: function() {
        var $this = this;

        $('#slider').append("<div id='navigation_slider'></div>");
        $('#navigation_slider').append("<ul></ul>");
        var numLi = Math.ceil(this.itemNumber / this.displayItemNumber);

        for (var i = 0; i < numLi; i++) {
            var item = $("<li><a href='#/demopage/" + (i + 1) + "' rel='" + i + "'></a></li>");
            $('#navigation_slider ul').append(item);
        }

        var ulWidth = (parseInt($('#navigation_slider ul li:first').width()) + parseInt($('#navigation_slider ul li:first').css('marginLeft').replace('px', '') * 2)) * numLi;
        $('#navigation_slider ul').css('width', ulWidth + 'px');

        $('#navigation_slider ul li a')
            .unbind('click')
            .bind('click', function(e) {
                e.preventDefault();
                $('#navigation_slider ul li a').removeClass();
                $(this).addClass('active');
                $this.moveScroll(parseInt($(this).attr('rel')));
            });


        $('a', '#navigation_slider ul li:first').trigger('click');
    },

    moveScroll: function(value) {
        $('#content_slider').stop(true, false).animate({'left': -(value * $('#slider').width())}, 1200, 'easeInOutQuart');
    },

    resize: function() {
        if ($('#content_slider').length > 0) {
            this.content_slider_w = $('#content_slider li.box4').length * parseInt(parseInt($('.box4').css('width').replace('px', '')) + (parseInt($('.box4').css('margin-left').replace('px', '')) * 2));
            $('#content_slider').css('width', this.content_slider_w);

            $('#navigation_slider ul li a.active').click();
        }
    }

};

$(document).ready(function() {

    //	GENERAL BEHAVIORS
    if ($("#home").length > 0) {
        $("h1 a, #menu ul li:first-child a")
            .unbind("click")
            .bind("click", function(e) {
                e.preventDefault();
                $.scrollTo.window().queue([]).stop();
                $.scrollTo(0, 1200, {easing: "easeInOutQuart", offset: {top: 0}});
            });
    }

    $("#link_demos, .link_demos, #link_learn_more")
        .unbind("click")
        .bind("click", function(e) {
            e.preventDefault();
            $.scrollTo.window().queue([]).stop();
            $.scrollTo($(e.target).attr("href"), 1200, {easing: "easeInOutQuart", offset: {top: -60}});
        });

    $("#link_login")
        .unbind("click")
        .bind("click", function(e) {
            e.preventDefault();
            $("#login:not(:visible)")
                .fadeIn("slow");

        });
    $("#content_login .close")
        .unbind("click")
        .bind("click", function(e) {
            e.preventDefault();
            $("#login:visible")
                .fadeOut("fast");

        });

    //	SEARCH INPUT
    $(".search input:first")
        .each(function() {
            $(this)
                .data("default", $(this).val())
                .focus(function() {
                    if ($(this).val() == $(this).data("default")) {
                        $(this).val("");
                    }

                })
                .blur(function() {
                    $(this).val($.trim($(this).val()));
                    if ($(this).val() == $(this).data("default") || $(this).val() == "") {
                        $(this)
                            .val($(this).data("default"));
                    }
                });
        });

    $(".search form").submit(function() {
        var value = $(".search input:first").val();
        var pattern = /[ ,\n,\r]/g;
        if (value.replace(pattern, "").length > 0) {
            alert("SEARCHING: " + value);
        }
    });

    //	SCROLLER DEMO
    if ($("#content_slider").length > 0) {
        DemoScroller.init();
    }
    //	PRESENTZ PLAYER
    else if ($("#presentation").length > 0) {
        Controls.init();
    }


    $(window)
        .unbind("resize")
        .bind("resize", function() {
            if ($("#content_slider").length > 0) {
                DemoScroller.resize();
            }
            if ($("#controls")) {
                Controls.resize();
            }
        });

});

window.toogle_css = function(elements_to_hide_selector, element_to_show_selector, key, value) {
    $(elements_to_hide_selector).each(function(idx, elem) {
        $(elem).css(key, value);
    });
    $(element_to_show_selector).css(key, "");
};