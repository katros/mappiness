// follow button
$(document).ready(function() {
    let username = $("#username-title").html();
    $(".follow")
        .unbind("click")
        .bind("click", () => {
            $.ajax({
                // AJAX
                url: `/protected/follow/${username}`,
                type: "GET",
                dataType: "json",
                success: function(data, status) {
                    console.log("at ajax", data);

                    // if it is NOT following = -1
                    if (data.following.indexOf(username) === -1) {
                        $(".follow").addClass("active");
                        $(".follow").text("Following");
                    } else {
                        $(".follow").removeClass("active");
                        $(".follow").text("Follow");
                    }
                }
            });
        });
});