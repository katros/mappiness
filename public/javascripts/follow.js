// follow button
$(document).ready(function() {
    $(".follow").click(function() {
        console.log("click");
        $.ajax({
            // AJAX
            url: "/protected/follow",
            type: "GET",
            dataType: "json",
            success: function(data, status) {
                console.log(data, status);
                // use jquery to change color + text of button
            }
        });
    });
});
