package com.paic.server

import unfiltered.netty.websockets._
import unfiltered.netty.websockets.Close
import unfiltered.netty.websockets.Message
import unfiltered.netty.websockets.Open
import unfiltered.netty.websockets.Text
import scala.collection.mutable.ConcurrentMap
import akka.actor.{Props, ActorSystem, ActorLogging, Actor}
import org.slf4j.{LoggerFactory, Logger}

import org.json4s._
import org.json4s.native.JsonMethods._
import org.json4s.JsonDSL._


object Messenger {
  val log: Logger = LoggerFactory.getLogger(Messenger.getClass)
  import scala.collection.JavaConversions._

  case class Message(s: String)

  class MessengerActor extends Actor with ActorLogging {
    def receive = {
      case Message(s) => Messenger.notify(s)
    }
  }

  val system = ActorSystem("MySystem")
  val messenger = system.actorOf(Props[MessengerActor], name = "messenger")

  def message(s:String) = messenger ! Message(s)

  val sockets: ConcurrentMap[Int, WebSocket] =
    new java.util.concurrent.ConcurrentHashMap[Int, WebSocket]

  def notify(msg: String) = sockets.values.foreach {
    s =>
      if (s.channel.isConnected) s.send( compact(render(("type" -> "message")~("data" ->msg))))
  }

  def plan = unfiltered.netty.websockets.Planify({
    case _ => {
      case Open(s) =>
        log.info(s"new socket open.")
        sockets += (s.channel.getId.intValue -> s)
    }
  }).onPass(_.sendUpstream(_))
}
