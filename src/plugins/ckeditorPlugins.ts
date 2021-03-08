import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'

import ListStylePlugin from '@ckeditor/ckeditor5-list/src/liststyle'

import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code'
import CodeBlockPlugin from '@ckeditor/ckeditor5-code-block/src/codeblock'

import TablePlugin from '@ckeditor/ckeditor5-table/src/table'
import TableToolbarPlugin from '@ckeditor/ckeditor5-table/src/tabletoolbar'

import ImagePlugin from '@ckeditor/ckeditor5-image/src/image'
import ImageStylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageResizePlugin from '@ckeditor/ckeditor5-image/src/imageresize'
import ImageUploadPlugin from '@ckeditor/ckeditor5-image/src/imageupload'
import ImageToolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import Base64UploadAdapterPlugin from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter'

export default [
  EssentialsPlugin,
  BoldPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListStylePlugin,
  CodePlugin,
  CodeBlockPlugin,
  ParagraphPlugin,
  TablePlugin,
  TableToolbarPlugin,
  ImagePlugin,
  ImageStylePlugin,
  ImageResizePlugin,
  ImageToolbarPlugin,
  ImageUploadPlugin,
  Base64UploadAdapterPlugin
]
