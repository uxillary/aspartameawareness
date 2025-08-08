/*
	Future Imperfect by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/


(function($) {

        const $window = $(window),
              $body = $('body'),
              $sidebar = $('#sidebar'),
              $main = $('#main');

        let headerInitialized = false;

        const initHeader = () => {
                if (headerInitialized) return;
                headerInitialized = true;

                const $menu = $('#menu');
                $menu
                        .appendTo($body)
                        .panel({
                                delay: 500,
                                hideOnClick: true,
                                hideOnSwipe: true,
                                resetScroll: true,
                                resetForms: true,
                                side: 'right',
                                target: $body,
                                visibleClass: 'is-menu-visible'
                        });

                const $search = $('#search');
                const $search_input = $search.find('input');

                $body.on('click', '[href="#search"]', (event) => {

                                event.preventDefault();

                                if (!$search.hasClass('visible')) {

                                        $search[0].reset();

                                        $search.addClass('visible');

                                        $search_input.focus();

                                }

                        });

                $search_input
                        .on('keydown', (event) => {

                                if (event.keyCode == 27)
                                        $search_input.blur();

                        })
                        .on('blur', () => {
                                window.setTimeout(() => {
                                        $search.removeClass('visible');
                                }, 100);
                        });
        };

document.addEventListener('headerLoaded', initHeader);
if (document.getElementById('menu')) initHeader();

        // Insert skip link for accessibility
        $('<a class="skip-link" href="#main">Skip to main content</a>').prependTo($body);

        // Breakpoints.
                breakpoints({
                        xlarge:   [ '1281px',  '1680px' ],
                        large:    [ '981px',   '1280px' ],
                        medium:   [ '737px',   '980px'  ],
                        small:    [ '481px',   '736px'  ],
                        xsmall:   [ null,      '480px'  ]
                });

        // Play initial animations on page load.
                $window.on('load', function() {
                        window.setTimeout(function() {
                                $body.removeClass('is-preload');
                        }, 100);
                });


	// Intro.
		var $intro = $('#intro');

		// Move to main on <=large, back to sidebar on >large.
			breakpoints.on('<=large', function() {
				$intro.prependTo($main);
			});

			breakpoints.on('>large', function() {
				$intro.prependTo($sidebar);
			});
    // Back to top button
    var $back = $('<a id="back-to-top" href="#" aria-label="Back to Top"><span aria-hidden="true" class="fa-solid fa-arrow-up"></span></a>').appendTo($body);
    $window.on('scroll', function() {
        if ($window.scrollTop() > 400) $back.addClass('visible');
        else $back.removeClass('visible');
    });
    $back.on('click', function(e){
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, 600);
    });
})(jQuery);