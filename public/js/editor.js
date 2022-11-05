// const editor = new EditorJS({
//     holder: 'editorjs',
// /** 
//      * Available Tools list. 
//      * Pass Tool's class or Settings object for each Tool you want to use 
//      */
//    tools:{
//     header: {
//         class: Header,
//         config: {
//           placeholder: 'Enter a header',
//           levels: [1, 2, 3, 4,5,6],
//           defaultLevel: 3
//         },
//      },
//        checklist: {
//         class: Checklist,
//         inlineToolbar: true,
//       },
//        delimiter: Delimiter,
//        paragraph: {
//         class: Paragraph,
//         inlineToolbar: true,
//       },
//       list: {
//         class: List,
//         inlineToolbar: true,
//         config: {
//           defaultStyle: 'unordered'
//         }
//       },
//       raw: RawTool,
//       embed: Embed,
//       image: SimpleImage,
//       embed: {
//         class: Embed,
//         config: {
//           services: {
//             youtube: true,
//             coub: true,
//             codepen: {
//               regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
//               embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
//               html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
//               height: 300,
//               width: 600,
//               id: (groups) => groups.join('/embed/')
//             }
//           }
//         }
//       },
//       quote: {
//         class: Quote,
//         inlineToolbar: true,
//         shortcut: 'CMD+SHIFT+O',
//         config: {
//           quotePlaceholder: 'Enter a quote',
//           captionPlaceholder: 'Quote\'s author',
//         },
//       },
  
//    }
// });


var Delta = Quill.import('delta');
var value1 = document.querySelector('#value1');
var quill = new Quill('#editor-container', {
modules: {
toolbar: [
// [{ 'indent': '-1'}, { 'indent': '+1' }],       
['bold', 'italic', 'underline', 'strike','blockquote', 'code-block','link'],
[{ 'align': [] }],
[{ 'list': 'ordered'}, { 'list': 'bullet' }],
[{ 'script': 'sub'}, { 'script': 'super' }],      
// ['formula'] ,
// [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
// [{ 'font': [] }],
// [{ 'size': ['small', false, 'large', 'huge'] }],        
[{ 'color': [] }, { 'background': [] }],  
]
},
placeholder: 'Write a feed....',
theme: 'snow'  // or 'bubble'
});
var change = new Delta();
var postVal = document.querySelector('#postValue');
quill.on('text-change', function(delta) {
change = change.compose(delta);
postVal.value = quill.root.innerHTML;
console.log(quill.root.innerHTML);
});
setInterval(function() {
  if (change.length() > 0) {
  console.log('Saving changes', change);
  change = new Delta();
  }
}, 5000);