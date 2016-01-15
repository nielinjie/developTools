package com.paic.server

import java.io.File

import io.netty.channel.ChannelHandler
import scala.collection.JavaConverters._


class Server(val handlers: List[ChannelHandler], val resource: File, val port: Int) {
  def this(handlers:java.util.List[ChannelHandler],resource:File,port:Int)=this(handlers.asScala.toList,resource,port)
  def service {
    handlers.foldLeft(unfiltered.netty.Http(port))({
      (http,handle)=>
        http.handler(handle)
    })
      //.handler(Messenger.plan)
      .resources(resource.getAbsoluteFile.getCanonicalFile.toURI.toURL)
      .run
  }
}
