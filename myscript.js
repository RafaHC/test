console.log('OBJ CANVAS', Sfdc);
console.log('SCRIPT EXTERNO CARREGADO');
const CLIENT_ID = '3MVG9zlTNB8o8BA0WftzWvuUI3IX9RhsejpRCL3jVcMIoTSv5g.fUB6U4gX78N_YRz120PyaGjj6wtftaTRGZ';
//console.log('window.opener', window.opener);
// if (window.opener) {
//     try {
//       window.opener.Sfdc.canvas.oauth.childWindowUnloadNotification(window.location.hash);
//     } catch (e) {
//       // do nothing
//     }
//     window.close();
//   }
// try {
//     window.opener.Sfdc.canvas.oauth.childWindowUnloadNotification(self.location.hash);
// } catch (ignore) {
//     console.log('ignore', ignore);
// }
// self.close();
function jsonSyntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
function contextCallback(msg) {
    var html, context;
    if (msg.status !== 200) {
        console.log('ERRO contextCallback');
        console.log('msg', msg);
        return;
    }
    console.log('SUCESSO contextCallback', jsonSyntaxHighlight(msg));
    Sfdc.canvas.byId('canvas-request-string').innerHTML = jsonSyntaxHighlight(msg.payload);
    Sfdc.canvas.client.autogrow(Sfdc.canvas.oauth.client());
}
function loginHandler(e) {
    var uri;
    if (!Sfdc.canvas.oauth.loggedin()) {
        uri = Sfdc.canvas.oauth.loginUrl();
        Sfdc.canvas.oauth.login({
            uri: uri,
            params: {
                response_type: "token",
                client_id: CLIENT_ID,
                redirect_uri: encodeURIComponent("https://poc-canvas-boti.herokuapp.com/sdk/callback.html")
            }
        });
    }
    else {
        Sfdc.canvas.oauth.logout();
        login.innerHTML = "Login";
        Sfdc.canvas.byId("oauth").innerHTML = "";
        Sfdc.canvas.byId('canvas-request-string').innerHTML = "";
    }
    return false;
}
// Bootstrap the page once the DOM is ready.
//Sfdc.canvas(function() { 
// On Ready...
var login = Sfdc.canvas.byId("login"),
    loggedIn = Sfdc.canvas.oauth.loggedin(),
    token = Sfdc.canvas.oauth.token();

console.log('loggedIn', loggedIn);
login.innerHTML = (loggedIn) ? "Logout" : "Login";

if (loggedIn) {
    console.log('CLIENT OBJ', Sfdc.canvas.oauth.client());
    // Only displaying part of the OAuth token for better formatting.
    Sfdc.canvas.byId("oauth").innerHTML = Sfdc.canvas.oauth.token().substring(1, 40) + "…";
    Sfdc.canvas.client.ctx(contextCallback, Sfdc.canvas.oauth.client());
}
login.onclick = loginHandler;
//});
// PROBLEMAS
/*
    * Como utilizar o mesmo token? O Salesforce tem limite de chamadas para autenticação. Acho que em janela movel em período de 1h, ainda assim existe limitação
    * Como controlar a sessão de chats abertos para não notificar o Salesforce todas as vezes via Serviço, já que não exise um broker?
*/
