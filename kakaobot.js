const ctx = KakaoTalk.getContext();

var Thread = java.lang.Thread;

var POWER = [true,];
var cmdList = ["power <on/off>", "info room", "help", "connect [add/remove] [방]", "eval [function...]"];
var thread = null;
var thread2 = null;
var isStart = false;

var Connection = function() {
  this.from = "";
  this.to = "";
  this.start = false;
}

var connection = [];
/*
var thread_ = new Thread({
  run: function() {
    while(isStart) {
      KakaoTalk.UIThread(function() {
        KakaoTalk.reply("HAEUN", "♚♚히어로즈 오브 더 스☆톰♚♚가입시$$전원 카드팩☜☜뒷면100%증정※ ♜월드오브 워크래프트♜펫 무료증정￥ 특정조건 §§디아블로3§§★공허의유산★초상화획득기회@@ 즉시이동http://kr.battle.net/heroes/ko/");
      });
      Thread.sleep(30 * 1000);
    }
  }
});*/

function response(room, msg, sender, isGroup) {
  for each(var i in connection) {
    if(room == i.from) {
      KakaoTalk.reply(i.to, "○ " + sender + " - " + i.from + " -> " + i.to + "\n● " + msg, true);
    }
  }
  
  var s = msg.split("/");
  s.shift();
  var cmd = s.join("/").split(" ");
  
  var m = (msg + "").replace(/ /g, "");
  if(m.indexOf("히오스") != -1 || m.indexOf("갓겜!") != -1 || m.indexOf("히어로즈") != -1) {
    KakaoTalk.replyLast("♚♚히어로즈 오브 더 스☆톰♚♚가입시$$전원 카드팩☜☜뒷면100%증정※ ♜월드오브 워크래프트♜펫 무료증정￥ 특정조건 §§디아블로3§§★공허의유산★초상화획득기회@@ 즉시이동http://kr.battle.net/heroes/ko/", true);
  }
  
  if(POWER[room] == null)
    POWER[room] = true;
  if(msg.indexOf("/") != -1) {
    KakaoTalk.UIThread(function() {
      KakaoTalk.Toast("Excute " + cmd[0] + " by " + sender).show();
    });
  }
  
  if(cmd[0] == "power") {
    POWER[room] = !POWER[room];
    if(cmd[1] == "on")
      POWER[room] = true;
    else if(cmd[1] == "off")
      POWER[room] = false;
    
    KakaoTalk.replyLast("KakaoBot's Power " + (POWER[room] ? "on" : "off"));
    return;
  }
  
  if(!POWER[room])
    return;
  
  if(cmd[0] != "") {
    if(sender.indexOf("#") != -1) {
      if(sender.split("#")[0] == "global.ban") {
        KakaoTalk.reply(room, sender.split("#")[1] + "님은 커맨드를 사용할 수 없습니다");
        return;
      }
    }
    if(room.indexOf("#") != -1) {
      if(room.split("#")[0] == "global.ban") {
        KakaoTalk.reply(room, room.split("#")[1] + "방에선 커맨드를 사용할 수 없습니다");
        return;
      }
    }
  }
  
  switch(cmd[0]) {
    case "info":
      if(cmd[1] == "room") {
        var room_list = KakaoTalk.getRoomList();
        var session_list = KakaoTalk.getSessionList();
        var i = 0;
        var session = null;
        for(i in room_list) {
          if(room_list[i] == room)
            session = session_list[i];
        }
        
        KakaoTalk.replyLast("Room: " + room + "\n  Session: " + session.toString() + "\n  isGroup: " + !isGroup + "\n  Sender: " + sender);
        return;
      }
    break;
    case "connect":
      if(cmd[1] == "add") {
        var from = cmd[2];
        var to = room;
        if(from == to) {
          KakaoTalk.reply(room, "같은방은 중계가 불가능합니다");
          return
        }
        var check = false;
        for each(var i in KakaoTalk.getRoomList()) {
          if(i == from) {
            check = true;
          }
        }
        if(!check) {
          KakaoTalk.reply(room, "방을 찾을 수 없습니다.");
          return;
        }
        KakaoTalk.UIThread(function() {
          var textview = new android.widget.TextView(ctx);
          textview.setText(from + " -> " + to + "로 연결을 " + sender + "가 요청했습니다.");
          var d = KakaoTalk.Dialog("Connect", textview, function() {
            var c = new Connection();
            c.from = from;
            c.to = to;
            connection.push(c);
            KakaoTalk.reply(room, "요청이 승인되었습니다.\n지금부터 " + from + " -> " + to + "방 중계를 시작합니다.");
            return;
          });
          d.show();
        });
      } else if(cmd[1] == "remove") {
        for(var i in connection) {
          if(connection[i].to == room && connection[i].from == cmd[2]) {
            connection.splice(i, 1);
            KakaoTalk.reply(room, "제거 완료");
            return;
          }
        }
        KakaoTalk.reply(room, "방을 찾을수 없습니다");
      }
      return;
    break;
    case "help":
      KakaoTalk.replyLast(cmdList.join("\n"));
      return;
    break;
    case "eval":
      cmd.shift();
      var s = cmd.join(" ");
      if(sender.indexOf("#") != -1) {
        if(sender.split("#")[0] == "ban") {
          KakaoTalk.reply(room, sender.split("#")[1] + "님은 eval 커맨드를 사용할 수 없습니다");
          return;
        }
      }
      if(room.indexOf("#") != -1) {
        if(room.split("#")[0] == "ban") {
          KakaoTalk.reply(room, room.split("#")[1] + "방에선 eval 커맨드를 사용할 수 없습니다");
          return;
        }
      }
      
      try {
        eval(s);
      } catch(e) {
        KakaoTalk.reply(room, e);
      }
      return;
    break;
  }
  if(msg.indexOf("/") != -1) {
    var name = cmd[0];
    cmd.shift();
    KakaoTalk.replyLast("Unknown Command: " + name + " with parameter " + cmd.join(" "));
  }
}