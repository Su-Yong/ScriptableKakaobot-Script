const ctx = KakaoTalk.getContext();

var Thread = java.lang.Thread;

var Command = {};
Command.Help = {
  Name: "Help",
  Command: ["help", "?", "도움", "도움말"],

  Execute: function(room, sender, parameter) {
    var str = "";
    if(parameter[0] == null) {
      for(var i in Command) {
        str += Command[i].Name + " - " + Command[i].Command.join(", ") + "\n";
        str += " > " + Command[i].Explain();
        str += "\n\n";
      }
    } else {
      for(var i in Command) {
        if(Command[i].Name === parameter[0]) {
          str += Command[i].Name + " - " + Command[i].Command.join(", ") + "\n";
          str += " > " + Command[i].Explain();
        }
      }
    }

    KakaoTalk.reply(room, str);
  },
  Explain: function(parameter) {
    return "사용 가능한 명령어를 설명 해줍니다.";
  }
};

Command.Eval = {
  Name: "JS Eval",
  Command: ["eval", "js"],

  Execute: function(room, sender, parameter) {
    KakaoTalk.reply(room, "현재 개발 중 입니다...");
  },
  Explain: function(parameter) {
    return "Javascript를 실행합니다.";

  }
};

Command.Channel = {
  Command: ["channel", "connect", "연결", "중계"],

  Execute: function(room, sender, parameter) {
    KakaoTalk.reply(room, "현재 개발 중 입니다...");
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

    for(var i in Command) {
      for(var j in Command[i].Command) {
        if(Command[i].Command[j] === command[0].toLowerCase()) {
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
