package domain.dsl

import java.io.File

import domain.dsl.EntitiesDSL.Property
import org.junit.Test
import org.junit.Assert._

import scalaz.Digit._1

/**
 * Created by nielinjie on 1/23/16.
 */
class ContextTest {
  val path = new File("./e")
  val context = new Builder(path).build()

  @Test
  def testContext()={
    assertEquals(1, context.domains.size)
    assertEquals(3, context.entityIndex.size)
  }
  @Test
  def entities()={
    val domain =  context.domains.head
    val e1= domain.entities.head
    assertEquals(7,e1.members().size)
    val e3 = domain.entities.last
    assertEquals(5,e3.members().size)
  }
  @Test
  def comments() = {
    assertEquals(3, context.comments.size)

    val c =context.comments.toList.sortWith({
      case (x,y) =>
        x._1.p.<(y._1.p)
    }).last
    assertEquals(context.at[Property](c._1).name,"口令")
  }
  @Test
  def positions ()={
    assertEquals(context.positions.size, context.productToPosition.size)
  }
}
