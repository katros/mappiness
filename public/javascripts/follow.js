// follow button
$(document).ready(function() {
    let username = $("#username-title").html();
    $(".follow").on("click", () => {
        $.ajax({
            // AJAX
            url: `/protected/follow/${username}`,
            type: "GET",
            dataType: "json",
            success: function(data, status) {
                console.log("at ajax", data);

                //if it is NOT following = -1

                if (data.following.indexOf(username) === -1) {
                    $(".follow").addClass("active");
                    $(".follow").text("Follow");
                } else {
                    $(".follow").removeClass("active");
                    $(".follow").text("Following");
                }
            }
        });
    });
});
// $(".follow")
//     .unbind("click")
//     .bind("click", () => {
//         if (data.following.indexOf(username) === -1) {
//             $(".follow").addClass("active");
//             $(".follow").text("Follow");
//         } else {
//             $(".follow").removeClass("active");
//             $(".follow").text("Following");
//         }
//     });
