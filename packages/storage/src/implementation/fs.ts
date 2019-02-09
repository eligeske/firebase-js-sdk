/**
 * 
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Some methods copied from goog.fs.
 * We don't include goog.fs because it pulls in a bunch of Deferred code that
 * bloats the size of the released binary.
 */
import * as array from './array';
import * as type from './type';

declare var IBlobBuilder;
declare var BlobBuilder;
declare var WebKitBlobBuilder;

function getBlobBuilder(): (typeof IBlobBuilder) | undefined {
  if (typeof BlobBuilder !== 'undefined') {
    return BlobBuilder;
  } else if (typeof WebKitBlobBuilder !== 'undefined') {
    return WebKitBlobBuilder;
  } else {
    return undefined;
  }
}

/**
 * Concatenates one or more values together and converts them to a Blob.
 *
 * @param var_args The values that will make up the resulting blob.
 * @return The blob.
 */
export function getBlob(...var_args: (string | Blob | ArrayBuffer)[]): Blob {
  let BlobBuilder = getBlobBuilder();
  if (BlobBuilder !== undefined) {
    let bb = new BlobBuilder();
    for (let i = 0; i < var_args.length; i++) {
      bb.append(var_args[i]);
    }
    return bb.getBlob();
  } else {
    if (type.isNativeBlobDefined()) {
      return new Blob(var_args);
    } else {
      throw Error("This browser doesn't seem to support creating Blobs");
    }
  }
}

/**
 * Slices the blob. The returned blob contains data from the start byte
 * (inclusive) till the end byte (exclusive). Negative indices cannot be used.
 *
 * @param blob The blob to be sliced.
 * @param start Index of the starting byte.
 * @param end Index of the ending byte.
 * @return The blob slice or null if not supported.
 */
export function sliceBlob(blob: Blob, start: number, end: number): Blob | null {
  if ((blob as any).webkitSlice) {
    return (blob as any).webkitSlice(start, end);
  } else if ((blob as any).mozSlice) {
    return (blob as any).mozSlice(start, end);
  } else if (blob.slice) {
    return blob.slice(start, end);
  }
  return null;
}
