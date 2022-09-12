@file:OptIn(ExperimentalStdlibApi::class)

package expo.modules.kotlin.methods

import com.facebook.react.bridge.JavaOnlyArray
import com.google.common.truth.Truth
import expo.modules.PromiseMock
import expo.modules.PromiseState
import expo.modules.assertThrows
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.ArgumentCastException
import expo.modules.kotlin.exception.InvalidArgsNumberException
import expo.modules.kotlin.types.toAnyType
import org.junit.Test
import kotlin.reflect.KType
import kotlin.reflect.typeOf

class AnyMethodTest {
  class MockedAnyMethod(
    desiredArgsTypes: Array<KType>
  ) : AnyMethod("my-method", desiredArgsTypes.map { it.toAnyType() }.toTypedArray()) {
    override fun callImplementation(args: Array<out Any?>, promise: Promise) {
      throw NullPointerException()
    }
  }

  @Test
  fun `call should throw if pass more arguments then expected`() {
    val method = MockedAnyMethod(arrayOf(typeOf<Int>()))
    val promise = PromiseMock()

    assertThrows<InvalidArgsNumberException>("Received 2 arguments, but 1 was expected.") {
      method.call(
        JavaOnlyArray().apply {
          pushInt(1)
          pushInt(2)
        },
        promise
      )
    }

    Truth.assertThat(promise.state).isEqualTo(PromiseState.NONE)
  }

  @Test
  fun `call should throw if pass less arguments then expected`() {
    val method = MockedAnyMethod(arrayOf(typeOf<Int>(), typeOf<Int>()))
    val promise = PromiseMock()

    assertThrows<InvalidArgsNumberException>("Received 1 arguments, but 2 was expected.") {
      method.call(
        JavaOnlyArray().apply {
          pushInt(1)
        },
        promise
      )
    }

    Truth.assertThat(promise.state).isEqualTo(PromiseState.NONE)
  }

  @Test
  fun `call should throw if cannot convert args`() {
    val method = MockedAnyMethod(arrayOf(typeOf<Int>()))
    val promise = PromiseMock()

    assertThrows<ArgumentCastException>(
      """
      Argument at index '0' couldn't be casted to type 'kotlin.Int' (received 'String').
      → Caused by: java.lang.ClassCastException: java.lang.String cannot be cast to java.lang.Number
      """.trimIndent()
    ) {
      method.call(
        JavaOnlyArray().apply {
          pushString("STRING")
        },
        promise
      )
    }

    Truth.assertThat(promise.state).isEqualTo(PromiseState.NONE)
  }

  @Test
  fun `sync exception shouldn't be converter into promise rejection`() {
    val method = MockedAnyMethod(emptyArray())
    val promise = PromiseMock()

    assertThrows<NullPointerException> {
      method.call(
        JavaOnlyArray(),
        promise
      )
    }

    Truth.assertThat(promise.state).isEqualTo(PromiseState.NONE)
  }
}
