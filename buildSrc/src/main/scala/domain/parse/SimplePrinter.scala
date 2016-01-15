package domain.parse

import org.kiama.output.PrettyPrinter




object SimplePrinter extends PrettyPrinter{
  def print(any:Any)={
    println(super.pretty_any(any).toString)
  }
}
