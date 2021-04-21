var tape = require("tape");

var protobuf = require("..");

var proto = "syntax = 'proto3'; message Inner { uint32 a = 1; string b = 2; } message Outer {repeated Inner inners = 1 [(js_preEncoded) = true];}";

tape.test("toArray", function(test) {
    var root = protobuf.parse(proto).root,
        Inner = root.lookup("Inner"),
        Outer = root.lookup("Outer");
    var msg = {inners: [
      {a: 10, b: "apple"},
      Inner.encode({a: 20, b: "banana"}).finish(),
      {a: 30, b: "carrot"},
      Inner.encode({a: 40, b: "daikon"}).finish(),
    ]};

    var dec = Outer.decode(Outer.encode(msg).finish());
    test.same(dec, {inners: [
      {a: 10, b: "apple"},
      {a: 20, b: "banana"},
      {a: 30, b: "carrot"},
      {a: 40, b: "daikon"},
    ]}, "should encode and decode back properly");

    test.same(Outer.verify(msg), null, "should verify");
    test.end();
});
