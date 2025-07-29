document.getElementById("enable-notifications").onclick = function() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function(permission) {
            fetch('/enable-notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: permission === 'granted' })
            })
            .then(res => res.json())
            .then(data => {
                if (data.redirect) window.location.href = data.redirect;
            });
        });
    } else {
            fetch('/enable-notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: false })
            })
            .then(res => res.json())
            .then(data => {
                if (data.redirect) window.location.href = data.redirect;
        });
    }
}

document.getElementById('not-now').onclick = function() {
    fetch('/enable-notifications', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ enabled: false })
    })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) window.location.href = data.redirect;
    });
}

