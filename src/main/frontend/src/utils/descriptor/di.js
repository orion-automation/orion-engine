
export default {
  "name": "DI",
  "uri": "http://www.omg.org/spec/DD/20100524/DI",
  "prefix": "di",
  "types": [
    {
      "name": "DiagramElement",
      "isAbstract": true,
      "properties": [
        {
          "name": "id",
          "isAttr": true,
          "isId": true,
          "type": "String"
        },
        {
          "name": "extension",
          "type": "Extension"
        },
        {
          "name": "owningDiagram",
          "type": "Diagram",
          "isReadOnly": true,
          "isVirtual": true,
          "isReference": true
        },
        {
          "name": "owningElement",
          "type": "DiagramElement",
          "isReadOnly": true,
          "isVirtual": true,
          "isReference": true
        },
        {
          "name": "modelElement",
          "isReadOnly": true,
          "isVirtual": true,
          "isReference": true,
          "type": "Element"
        },
        {
          "name": "style",
          "type": "Style",
          "isReadOnly": true,
          "isVirtual": true,
          "isReference": true
        },
        {
          "name": "ownedElement",
          "type": "DiagramElement",
          "isReadOnly": true,
          "isMany": true,
          "isVirtual": true
        }
      ]
    },
    {
      "name": "Node",
      "isAbstract": true,
      "superClass": [
        "DiagramElement"
      ]
    },
    {
      "name": "Edge",
      "isAbstract": true,
      "superClass": [
        "DiagramElement"
      ],
      "properties": [
        {
          "name": "source",
          "type": "DiagramElement",
          "isReadOnly": true,
          "isVirtual": true,
          "isReference": true
        },
        {
          "name": "target",
          "type": "DiagramElement",
          "isReadOnly": true,
          "isVirtual": true,
          "isReference": true
        },
        {
          "name": "waypoint",
          "isUnique": false,
          "isMany": true,
          "type": "dc:Point",
          "xml": {
            "serialize": "xsi:type"
          }
        }
      ]
    },
    {
      "name": "Diagram",
      "isAbstract": true,
      "properties": [
        {
          "name": "id",
          "isAttr": true,
          "isId": true,
          "type": "String"
        },
        {
          "name": "rootElement",
          "type": "DiagramElement",
          "isReadOnly": true,
          "isVirtual": true
        },
        {
          "name": "name",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "documentation",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "resolution",
          "isAttr": true,
          "type": "Real"
        },
        {
          "name": "ownedStyle",
          "type": "Style",
          "isReadOnly": true,
          "isMany": true,
          "isVirtual": true
        }
      ]
    },
    {
      "name": "Shape",
      "isAbstract": true,
      "superClass": [
        "Node"
      ],
      "properties": [
        {
          "name": "bounds",
          "type": "dc:Bounds"
        }
      ]
    },
    {
      "name": "Plane",
      "isAbstract": true,
      "superClass": [
        "Node"
      ],
      "properties": [
        {
          "name": "planeElement",
          "type": "DiagramElement",
          "subsettedProperty": "DiagramElement-ownedElement",
          "isMany": true
        }
      ]
    },
    {
      "name": "LabeledEdge",
      "isAbstract": true,
      "superClass": [
        "Edge"
      ],
      "properties": [
        {
          "name": "ownedLabel",
          "type": "Label",
          "isReadOnly": true,
          "subsettedProperty": "DiagramElement-ownedElement",
          "isMany": true,
          "isVirtual": true
        }
      ]
    },
    {
      "name": "LabeledShape",
      "isAbstract": true,
      "superClass": [
        "Shape"
      ],
      "properties": [
        {
          "name": "ownedLabel",
          "type": "Label",
          "isReadOnly": true,
          "subsettedProperty": "DiagramElement-ownedElement",
          "isMany": true,
          "isVirtual": true
        }
      ]
    },
    {
      "name": "Label",
      "isAbstract": true,
      "superClass": [
        "Node"
      ],
      "properties": [
        {
          "name": "bounds",
          "type": "dc:Bounds"
        }
      ]
    },
    {
      "name": "Style",
      "isAbstract": true,
      "properties": [
        {
          "name": "id",
          "isAttr": true,
          "isId": true,
          "type": "String"
        }
      ]
    },
    {
      "name": "Extension",
      "properties": [
        {
          "name": "values",
          "isMany": true,
          "type": "Element"
        }
      ]
    }
  ],
  "associations": [],
  "xml": {
    "tagAlias": "lowerCase"
  }
};
