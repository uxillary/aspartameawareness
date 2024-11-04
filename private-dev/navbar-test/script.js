$(document).ready(function() {
    $('.compound-icon svg').hover(
        function() {
            $(this).find('circle').css('fill', '#2ebaae'); // Change color on hover
        },
        function() {
            $(this).find('circle').css('fill', 'none'); // Reset color when not hovering
        }
    );
});
