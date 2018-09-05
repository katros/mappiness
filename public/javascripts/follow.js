// follow button
$(document).ready(function() {
    let username = $("#username-title").html();
    $(".follow").click(function() {
        $.ajax({
            // AJAX
            url: `/protected/follow/${username}`,
            type: "GET",
            dataType: "json",
            success: function(data, status) {
                console.log(data, status);
                // use jquery to change color + text of button
            }
        });
    });
});

//
