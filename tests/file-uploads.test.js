import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PROJECT_FILE_ACCEPT,
  STANDARD_FILE_LIMIT,
  VIDEO_FILE_LIMIT,
  suggestedDocumentType,
  uploadContentType,
  uploadFileKind,
  validateUploadFile,
} from '../src/job-manager/utils/fileUploads.js'

const file = (name, type, size = 1024) => ({ name, type, size })

test('project picker accepts Word and common mobile video formats', () => {
  assert.match(PROJECT_FILE_ACCEPT, /\.docx/)
  assert.match(PROJECT_FILE_ACCEPT, /video\/quicktime/)
  assert.match(PROJECT_FILE_ACCEPT, /\.mp4/)
})

test('Word and video files are classified and suggested automatically', () => {
  assert.equal(uploadFileKind(file('scope.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')), 'word')
  assert.equal(suggestedDocumentType(file('site-walk.mov', 'video/quicktime')), 'Video')
  assert.equal(suggestedDocumentType(file('handover.doc', 'application/msword')), 'Word document')
})

test('mobile files with a generic MIME type use their extension safely', () => {
  assert.doesNotThrow(() => validateUploadFile(file('site-walk.MOV', 'application/octet-stream', VIDEO_FILE_LIMIT)))
  assert.equal(uploadContentType(file('site-walk.MOV', 'application/octet-stream')), 'video/quicktime')
  assert.equal(uploadContentType(file('scope.DOCX', '')), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
})

test('video and non-video uploads enforce separate size limits', () => {
  assert.doesNotThrow(() => validateUploadFile(file('site.mp4', 'video/mp4', VIDEO_FILE_LIMIT)))
  assert.throws(() => validateUploadFile(file('site.mp4', 'video/mp4', VIDEO_FILE_LIMIT + 1)), /50 MB/)
  assert.throws(() => validateUploadFile(file('scope.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', STANDARD_FILE_LIMIT + 1)), /25 MB/)
})

test('photo uploads remain restricted to image formats', () => {
  assert.throws(() => validateUploadFile(file('scope.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), 'photos'), /Use JPG/)
})
