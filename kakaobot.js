const ctx = KakaoTalk.getContext();

var Thread = java.lang.Thread;

var Command = {};
Command.Help = {
  Name: "Help",
  Command: ["help", "?", "도움", "도움말"],

  Execute: function(room, sender, parameter) {
    var str = "";
    if(parameter[0] == null) {
      var check = false;
      for(var i in Command) {
        if(check) {
          str += "\n\n";
        }

        str += Command[i].Name + " - " + Command[i].Command.join(", ") + "\n";
        str += " > " + Command[i].Explain();

        check = true;
      }
    } else {
      for(var i in Command) {
        for(var j in Command[i].Command) {
          if(Command[i].Command[j] === parameter[0].toLowerCase()) {
            str += Command[i].Name + " - " + Command[i].Command.join(", ") + "\n";
            str += " > " + Command[i].Explain();
          }
        }
      }
    }

    KakaoTalk.reply(room, str, true);
  },
  Explain: function(parameter) {
    return "사용 가능한 명령어를 설명 해줍니다.";
  }
};

Command.Eval = {
  Name: "JS Eval",
  Command: ["eval", "js"],

  Execute: function(room, sender, parameter) {
    try {
      eval(parameter.join(" "));
    } catch(err) {
      KakaoTalk.reply(room, err, true);
    }
  },
  Explain: function(parameter) {
    return "Javascript를 실행합니다.";
  }
};

Command.Api = {
  Name: "API",
  Command: ["api"],

  Execute: function(room, sender, parameter) {
    var str = "";
    var check = false;
    for each(var method in Object.getOwnPropertyNames(KakaoTalk)) {
      if(check) {
        str += "\n";
      }
      if(method == "arguments") {
        break;
      }

      str += "KakaoTalk." + method;
      check = true;
    }

    KakaoTalk.reply(room, str, true);
  },
  Explain: function(parameter) {
    return "KakaoBot의 API를 나열합니다.";
  }
};

Command.Connect = {
  Name: "Connect",
  Command: ["connect", "연결", "중계"],

  Execute: function(room, sender, parameter) {
    var channel = new Channel();
    channel.to = room;

    for each(var r in KakaoTalk.getRoomList()) {
      var origin = r;
      if(r.indexOf("#") != -1) {
        r = r.split("#")[1];
      }
      if(parameter[0] === r) {
        channel.from = origin;
      }
    }
    if(!channel.from == "") {
      KakaoTalk.reply(room, "방을 찾을 수 없습니다.", true);
    } else {
      KakaoTalk.UIThread(function() {
        var dialog = KakaoTalk.Dialog(channel.from + " -> " + channel.to, null, function() {
          channels.push(channel);
          KakaoTalk.reply(room, channel.from + " -> " + channel.to + " 중계를 시작합니다.", true);
        });
        dialog.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
          onDismiss: function(android.content.DialogInterface interface) {
            KakaoTalk.reply(room, "방 중계가 거절되었습니다.", true);
          }
        }));
        dialog.show();
      });
    }
  },
  Explain: function(parameter) {
    return "특정 방의 메세지를 이 방으로 중계 해줍니다.";
  }
};

Command.Disconnect = {
  Name: "Disconnect",
  Command: ["disconnect", "연결해제", "중계중단", "중계중지", "중계멈춤"],

  Execute: function(room, sender, parameter) {
    for(var i in channels) {
      if(parameter[0] == channels[i].from && room == channels[i].to) {
        KakaoTalk.reply(room, channels[i].from + " -> " + channels[i].to + " 중계를 중지합니다.", true);
        channels.splice(i, 1);
        return;
      }
    }

    KakaoTalk.reply(room, "방을 찾을 수 없습니다.", true);
  },
  Explain: function(parameter) {
    return "중계를 중지합니다.";
  }
};

var Channel = function() {
  this.from = "";
  this.to = "";
}

var channels = [];

var CommandChar = "/";

function response(room, message, sender, isGroup) {
  if(message[0] == CommandChar) {
    var charDeleter = message.split("");
    charDeleter.shift();

    var command = charDeleter.join("").split(" ");

    if(sender.indexOf("#") != -1) {
      var ban = sender.split("#")[0];
      var what = ban.split(".")[0];
      if(what === "global") {
        KakaoTalk.reply(room, sender.split("#")[1] + "님은 이 명령어를 쓸 수 없습니다.");
      }
      return;
    }

    if(room.indexOf("#") != -1) {
      var ban = room.split("#")[0];
      var what = ban.split(".")[0];
      if(what === "global") {
        KakaoTalk.reply(room, room.split("#")[1] + "방에서는 명령어를 쓸 수 없습니다.");
      }
      return;
    }

    for(var i in Command) {
      for(var j in Command[i].Command) {
        if(Command[i].Command[j] === (command[0] + "").toLowerCase()) {
          if(sender.indexOf("#") != -1) {
            var ban = sender.split("#")[0];
            var what = ban.split(".")[0];
            if(what === (command[0] + "").toLowerCase()) {
              KakaoTalk.reply(room, sender.split("#")[1] + "님은 이 명령어를 쓸 수 없습니다.");
            }
            continue;
          }
          if(room.indexOf("#") != -1) {
            var ban = room.split("#")[0];
            var what = ban.split(".")[0];
            if(what === (command[0] + "").toLowerCase()) {
              KakaoTalk.reply(room, room.split("#")[1] + "방에서는 이 명령어를 쓸 수 없습니다.");
            }
            continue;
          }

          var parameter = command;
          parameter.shift();

          Command[i].Execute(room, sender, parameter);
        }
      }
    }
  } else {
    for each(var channel in channels) {
      if(channel.from == room) {
        KakaoTalk.reply(channel.to, "> " + sender + " : " + channel.from + " -> " + channel.to + "\n> " + message, true);
      }
    }
  }
}
