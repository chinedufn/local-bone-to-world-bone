var local2WorldBone = require('../')

var test = require('tape')

// We took this data from the
// Letter F Animated Model from collada-dae-parser unit tests
// keyframe: `1.666667`
test('Convert from local bone space to world bone space', function (t) {
  var jointParents = {
    Bone: null,
    Bone_001: 'Bone',
    Bone_002: 'Bone_001'
  }

  var localBoneMatrices = [
    // Bone
    [ 1.656533, 0, 0, 0, 0, 0, -1.656533, 0, 0, 1.656533, 0, 0, 0, 0, 0, 1 ],
    // Bone_001
    [ -3.09086e-8, 0.7071067, -0.7071068, 0, 3.09086e-8, 0.7071068, 0.7071068, 1, 1, 0, -4.37114e-8, 0, 0, 0, 0, 1 ],
    // Bone_002
    [ 3.17865e-8, -4.37114e-8, -1, 0, 1, 0, 3.17865e-8, 2.152902, 0, -1, 4.37114e-8, 0, 0, 0, 0, 1 ]
  ]

  var jointIndices = {
    Bone: 0,
    Bone_001: 1,
    Bone_002: 2
  }
  var expectedBoneWorlds = [
    [ 1.656533, 0, 0, 0, 0, 0, -1.656533, 0, 0, 1.656533, 0, 0, 0, 0, 0, 1 ],
    [ -0, 1.171346, -1.171346, 0, -1.656533, 0, 0, 0, 0, 1.171346, 1.171346, 1.656533, 0, 0, 0, 1 ],
    [ 1.171346, 1.171346, 0, 2.521792, -0, 0, 1.656533, 0, 1.171346, -1.171346, 0, 4.178326, 0, 0, 0, 1 ]
  ]

  t.deepEqual(
    expectedBoneWorlds.map(roundTo6Decimals),
    local2WorldBone(localBoneMatrices, jointParents, jointIndices).map(roundTo6Decimals),
    'Convert bones from local bone space to world bone space'
  )

  t.end()

  function roundTo6Decimals (bones) {
    return bones.map(function (val) {
      return parseFloat(val.toFixed(6))
    })
  }
})
