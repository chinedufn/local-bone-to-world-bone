var mat4Multiply = require('gl-mat4/multiply')

module.exports = local2WorldBone

/**
 * Convert bones from local bone space into world bone space
 *
 * You'll typically do this once during a processing step for your
 * model data before using your joints for skeletal animation
 */
function local2WorldBone (localBoneMatrices, jointParents, jointIndices) {
  // bone name -> world bone space matrix
  var worldMatrices = []

  // Get a map of parent -> children that we'll use to build a tree that we'll
  // traverse in order to calculate world bone matrices
  var boneChildrenMap = {}
  // Get the names of all of the top level bones so that
  // we can build our tree of bone parent -> children starting from
  // these nodes
  var rootParents = []

  // Make a map of parent -> children
  for (var boneName in jointParents) {
    var parentName = jointParents[boneName]
    if (parentName) {
      boneChildrenMap[parentName] = boneChildrenMap[parentName] || []
      boneChildrenMap[parentName].push(boneName)
    } else {
      rootParents.push(boneName)
    }
  }

  // Traverse our bone tree and calculate all world bone matrices
  rootParents.forEach(function (boneName) {
    iterateOverChildren(boneName)
  })

  /**
   * Calculate a bone's world bone space matrix and then calculate its childrens' world space matrices
   */
  function iterateOverChildren (boneParent) {
    calculateWorldMatrix(boneParent)
    if (boneChildrenMap[boneParent]) {
      boneChildrenMap[boneParent].forEach(function (childName) {
        iterateOverChildren(childName)
      })
    }
  }

  /**
   * Calculate a bone's world bone space matrix by multiply it's local space matrix
   * by it's parents world bone space matrix, if it has a parent
   */
  function calculateWorldMatrix (boneName) {
    var jointIndex = jointIndices[boneName]
    var boneLocalSpace = localBoneMatrices[jointIndex]
    var boneParentIndex = jointIndices[jointParents[boneName]]

    // If it has a parent multiply by it's parent world space matrix
    if (worldMatrices[boneParentIndex]) {
      worldMatrices[jointIndex] = mat4Multiply([], boneLocalSpace, worldMatrices[boneParentIndex])
    } else {
      // Otherwise just return the local matrix (this happens for top level bones with no parents)
      worldMatrices[jointIndex] = boneLocalSpace
    }
  }

  return worldMatrices
}
