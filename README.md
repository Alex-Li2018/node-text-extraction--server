# NODE-TEXT-EXTRACTION-SERVER

Docx reading Server, Easily generate **.docx structure data**  with JS/TS. Works for Node.

## structure data
```json
{
    "code": 200,
	"data": {
        "word_document": [
            {
            // word内容
            "type": "documentPart",
                "body": {},
                // 解析的是那个xml
                "path": "word/document.xml" 
            },
            {   
                // word扩展属性
                "type": "extendedPropsPart",
                "props": {},
                "path": "docProps/app.xml"
            },
            {
                // word核心属性
                "type": "corePropsPart",
                "props": {},
                "path": "docProps/core.xml"
            },
            {
                // 页眉
                "type": "footnotesPart",
                "props": {},
                "path": {}
            },
            {
                // 页脚
                "type": "endnotesPart",
                "props": {},
                "path": {}
            },
            {
                // 主题
                "type": "themePart",
                "props": {},
                "path": {}
            },
        ],
    },
    "msg": "success"
}
```


## document structure data

```
层级结构:
    - document
        - paragraph
            - run
                - text
```

```json
{
    // word内容
    "type": "documentPart",
    "body": {
        "type": "document",
        "children": [
            {
                "type": "paragraph",
                "paragraph_text": "一、活动时间：3月15日",
                "children": [
                    {
                        "type": "run",
                        "parent": null,
                        "children": [
                            {
                                "type": "text",
                                "text": "一、活动时间：",
                                "id": 79
                            }
                        ],
                        "cssStyle": {
                            "font-family": "微软雅黑 Light",
                            "font-weight": "bold"
                        },
                        "id": 16,
                        "parent_id": 3
                    },
                    {
                        "type": "run",
                        "parent": null,
                        "children": [
                            {
                                "type": "text",
                                "text": "3月15日",
                                "id": 79
                            }
                        ],
                        "cssStyle": {
                            "font-family": "微软雅黑 Light",
                            "font-weight": "bold"
                        },
                        "id": 17,
                        "parent_id": 3
                    }
                ]
            },
            {
                "type": "paragraph",
                "children": []
            }
        ]
    },
    "path": "word/document.xml" 
},
```

## service respond
[detail](./detail.json)

## Relation

- [docx](https://github.com/dolanmiu/docx)
- [mammoth.js](https://github.com/mwilliamson/mammoth.js)
- [Open-XML-SDK](https://github.com/OfficeDev/Open-XML-SDK)
- [OOXML](http://officeopenxml.com/)
- **[OOXML](http://officeopenxml.com/anatomyofOOXML.php)**

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

####  physical machine
```bash
# ci
$ npm run tsc
$ npm start
```

#### Docker
[Dockerfile](./script/Dockerfile)


### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 12.x
- Typescript 2.8+

## end

If you want to contribute code, please contact **me(alexlismile@163.com)** first.
