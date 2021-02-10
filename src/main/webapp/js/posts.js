$(document).ready(function () {
    function sendReaction(id, reaction){
        $.ajax({
            type: 'PUT',
            url: './react',
            headers: {id: id, reaction: reaction}, //Can't read data as parameters if type='PUT', so use headers
            success: function(data) {
                alert(data);
            }
        });
    }

    $("body").on("click", ".message .btn-like", function() {
        const id = $(this).closest(".message").attr("data-message-id");
        sendReaction(id, "like");
    }).on("click", ".message .btn-dislike", function() {
        const id = $(this).closest(".message").attr("data-message-id");
        sendReaction(id, "dislike");
    });
})
