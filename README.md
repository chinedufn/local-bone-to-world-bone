local-bone-to-world-bone [![npm version](https://badge.fury.io/js/local-bone-to-world-bone.svg)](http://badge.fury.io/js/local-bone-to-world-bone) [![Build Status](https://travis-ci.org/chinedufn/local-bone-to-world-bone.svg?branch=master)](https://travis-ci.org/chinedufn/local-bone-to-world-bone)
===========

> Calculate the world bone space matrices for a set of local bone space matrices

## Background / Initial motivation

I'm exporting some pose matrices from Blender and want to calculate the world bone
transformations. I wrote some code over a year ago in `collada-dae-parser` to do this
but it was a bit hacky so wrote something that I can make use of outside standalone.

## Install

```sh
npm install --save local-bone-to-world-bone
```

## Usage

```js
var local2WorldBone = require('local-bone-to-world-bone')

// childBoneName: parentBoneName
var jointParents = {
  lower_back: null,
  upper_back: lowerBack,
  shoulder_left: upperBack,
  shoulder_right: upperBack
}

// childBoneName: indexInArrayOfPoseMatrices
var jointIndices = {
  lower_back: 0,
  upper_back: 1,
  should_left: 3,
  shoulder_right: 2
}

// An array of local bone matrices, ordered by the above jointIndices array
var localBoneMatrices = [
  // These probably won't all be identity matrices when using real data
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
]

var worldBoneMatrices = local2WorldBone(localBoneMatrices, jointParents, jointIndices)
console.log(worldBoneMatrices)
  /**
   * All of your bone world transformation matrices in the same order as your local bones
   * [
   *   [...],
   *   [...],
   *   [...],
   *   [...]
   * ]
   */
```

## API

### `local2WorldBone(localPoseMatrices, jointParents, jointIndices)` -> `worldPoseMatrices`

#### poseMatrices

Type: `Array[numBones][16]`

```js
[
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], // someOtherRootBone
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], // childOfSecondRootBone
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], // parentBone
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], // childBone
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]  // childChildBone
]
```

An array that has the pose matrix for each bone. Note that they won't typically be
identity matrices as they are in this trivial example.

#### jointParents

Type: `Object`

```js
{
  parentBone: null,
  childBone: parentBone,
  childChildBone: childBone,
  someOtherRootBone: null,
  childOfSecondRootBone: someOtherRootBone
}
```

An object that maps each bone to it's parent, or null if it is a root bone

#### jointIndices

Type: `Object`

```js
{
  parentBone: 2,
  childBone: 3,
  childChildBone: 4,
  someOtherRootBone: 0,
  childOfSecondRootBone: 1
}
```

#### (returned) worldPoseMatrices

Type: `Array[numBones][16]`

```js
[
  [...],
  [...],
  [...],
  [...],
  [...]
]
```

We return an array of the world bone poses. You typically want to then multiple
each world matrix by the bone's inverse bind matrix before making use of it.

## Have an idea? Something not clicking?

Open an issue!

## License

(c) 2017 Chinedu Francis Nwafili. MIT License
