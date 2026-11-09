#include <jni.h>
#include "nitroquicklookOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitroquicklook::initialize(vm);
}
