package domain.parse

import org.kiama.output.PrettyPrinter
import org.slf4j.{Logger, LoggerFactory}

/**
  * Created by nielinjie on 1/14/16.
  */
object Printer extends PrettyPrinter{
  val log: Logger = LoggerFactory.getLogger(Printer.getClass)

  def print(any:Any) ={
    log.debug(super.pretty_any(any).toString)
  }
}
