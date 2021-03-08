import CKEditorPlugins from './ckeditorPlugins'

const CKEditorConfig = {
  image: {
    resizeUnit: 'px',
    resizeOptions: [
      {
        name: 'imageResize:original',
        value: null,
        label: 'original'
      },
      {
        name: 'imageResize:100',
        value: '100',
        label: '100 px'
      },
      {
        name: 'imageResize:200',
        value: '200',
        label: '200 px'
      },
      {
        name: 'imageResize:300',
        value: '300',
        label: '300 px'
      }
    ],
    toolbar: [
      'imageResize'
    ]
  },
  plugins: CKEditorPlugins,
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  },
  toolbar: {
    items: [
      'bold', 'italic', 'link', '|',
      'bulletedList', 'todoList', '|',
      'insertTable', 'imageUpload', '|',
      'code', 'codeBlock', '|',
      'undo', 'redo'
    ]
  }
}

export default CKEditorConfig
