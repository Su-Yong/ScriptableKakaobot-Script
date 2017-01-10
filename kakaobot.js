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
  },
  Explain: function(parameter) {
    return "KakaoBot의 API를 나열합니다.";
  }
};

Command.Channel = {
  Name: "Channel",
  Command: ["channel", "connect", "연결", "중계"],

  Execute: function(room, sender, parameter) {
    
  },
  Explain: function(parameter) {
    return "특정 방의 메세지를 이 방으로 중계 해줍니다.";
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
    // Nothing
  }
}
