import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PROJECT_FILE_ACCEPT,
  STANDARD_FILE_LIMIT,
  VIDEO_FILE_LIMIT,
  documentPreviewKind,
  friendlyUploadError,
  suggestedDocumentType,
  uploadContentType,
  uploadFileKind,
  validateUploadFile,
} from '../src/job-manager/utils/fileUploads.js'

const file = (name, type, size = 1024) => ({ name, type, size })

test('project picker accepts Word and common mobile video formats', () => {
  assert.match(PROJECT_FILE_ACCEPT, /\.docx/)
  assert.match(PROJECT_FILE_ACCEPT, /\.txt/)
  assert.match(PROJECT_FILE_ACCEPT, /video\/quicktime/)
  assert.match(PROJECT_FILE_ACCEPT, /\.mp4/)
})

test('Word and video files are classified and suggested automatically', () => {
  assert.equal(uploadFileKind(file('scope.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')), 'word')
  assert.equal(suggestedDocumentType(file('site-walk.mov', 'video/quicktime')), 'Video')
  assert.equal(suggestedDocumentType(file('handover.doc', 'application/msword')), 'Word document')
})

test('document preview uses the stored filename when the display name has no extension', () => {
  assert.equal(documentPreviewKind({
    name: 'Ictinus-Contractors-Quotation-67-Wernbrook-Street-Final',
    type: 'Quotation',
    storagePath: 'project/documents/123-ictinus-contractors-quotation-final.pdf',
  }), 'pdf')
  assert.equal(documentPreviewKind({ name: 'Site notes', storagePath: 'project/documents/site-notes.docx' }), 'docx')
  assert.equal(documentPreviewKind({ name: 'Snagging list', storagePath: 'project/documents/snagging-list.txt' }), 'text')
})

test('mobile files with a generic MIME type use their extension safely', () => {
  assert.doesNotThrow(() => validateUploadFile(file('site-walk.MOV', 'application/octet-stream', VIDEO_FILE_LIMIT)))
  assert.equal(uploadContentType(file('site-walk.MOV', 'application/octet-stream')), 'video/quicktime')
  assert.equal(uploadContentType(file('scope.DOCX', '')), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  assert.equal(uploadContentType(file('notes.TXT', '')), 'text/plain')
})

test('video and non-video uploads enforce separate size limits', () => {
  assert.doesNotThrow(() => validateUploadFile(file('site.mp4', 'video/mp4', VIDEO_FILE_LIMIT)))
  assert.throws(() => validateUploadFile(file('site.mp4', 'video/mp4', VIDEO_FILE_LIMIT + 1)), /50 MB/)
  assert.throws(() => validateUploadFile(file('scope.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', STANDARD_FILE_LIMIT + 1)), /25 MB/)
})

test('project gallery accepts photos and mobile videos but rejects documents', () => {
  assert.doesNotThrow(() => validateUploadFile(file('camera-roll.mov', 'video/quicktime'), 'photos'))
  assert.doesNotThrow(() => validateUploadFile(file('site-video.MP4', 'application/octet-stream'), 'photos'))
  assert.throws(() => validateUploadFile(file('scope.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), 'photos'), /Use JPG/)
})

test('expense attachments accept receipts and text but reject Word and video files', () => {
  assert.doesNotThrow(() => validateUploadFile(file('receipt.pdf', 'application/pdf'), 'expenses'))
  assert.doesNotThrow(() => validateUploadFile(file('receipt.HEIC', 'application/octet-stream'), 'expenses'))
  assert.doesNotThrow(() => validateUploadFile(file('notes.txt', 'text/plain'), 'expenses'))
  assert.throws(() => validateUploadFile(file('invoice.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), 'expenses'), /Use PDF/)
  assert.throws(() => validateUploadFile(file('walkthrough.mp4', 'video/mp4'), 'expenses'), /Use PDF/)
})

test('technical upload errors are translated into clear next steps', () => {
  assert.equal(friendlyUploadError(new Error('mime type application/example is not supported')), 'This file type is not accepted. Choose a PDF, image, Word, TXT or supported video file.')
  assert.match(friendlyUploadError(new Error('Payload too large')), /too large/)
  assert.match(friendlyUploadError(new Error('Network request failed')), /internet connection/)
})
