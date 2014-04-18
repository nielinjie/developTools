var ws = $.websocket("ws://127.0.0.1:8080/", {
        open: function() {},
        close: function() {},
        events: {
            message: function(m){
                console.info(m)
            }
        }
});

