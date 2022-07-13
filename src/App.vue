<template>
  <div class="main">
    <!-- 格式化选项 -->
    <div class="options">
      <div class="indent">
        <div class="category">indent</div>
        <el-input-number v-model="indentConfig.indent" :min="1" :max="10" @change="getConfig" />
      </div>
      <el-checkbox-group v-model="checkList">
        <div class="list" v-for="(value, name, index) in spaceConfig" :key="index">
          <div class="category" data-action="toggle-item">
            {{name}}
            <!-- <span class="fold" data-action="toggle-item">-</span> -->
          </div>
          <div class="block"  v-for="(v, i) in value" :key="i">
            <el-checkbox class="option" :label="v" @change="getConfig" />
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <!-- 源代码 -->
    <div class="source">
      <textarea spellcheck="false" v-model="sourceCode"></textarea>
    </div>
    <!-- 格式化效果 -->
    <div class="panel">
      <highlightjs language="javascript" :code="newCode" />
    </div>
  </div>
</template>

<script>
import * as espree from "espree"
import 'element-plus/es/components/input-number/style/css'
import 'element-plus/es/components/checkbox/style/css'
import { ElInputNumber, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { onMounted, reactive, toRefs } from "vue"
export default {
  setup() {
    const state = reactive({
      indentConfig: {
          indent: 4,
      },
      spaceConfig: {
          before_parentheses: [
              // 函数定义
              "function_declaration",
              // 函数调用
              "function_call",
              "if",
              "for",
              "while",
              "switch",
              "catch",
              "function_expression",
              "async_arrow_function",
          ],
          around_operator: [
              // =, +=, -=
              "assignment_operator",
              // &&, ||
              "logical_operator",
              // ==, !=, '===', '!=='
              "equality_operator",
              // <, >, <=
              "relational_operator",
              // &, |, ^
              "bitwise_operator",
              // +, -,
              "additive_operator",
              // *, /, %
              "multiplicative_operator",
              // <<, >>, >>>
              "shift_operators",
              // +, -, ++, --
              "unary_additive_operators",
              // =>
              "arrow_function",
              // !, !!
              "before_unary",
              // !, !!
              "after_unary",
          ],
          before_left_brace: [
              "function_left_brace",
              "if_left_brace",
              "else_left_brace",
              "for_left_brace",
              "while_left_brace",
              "do_left_brace",
              "switch_left_brace",
              "try_left_brace",
              "catch_left_brace",
              "finally_left_brace",
              "class_left_brace",
          ],
          before_keywords: [
              "else_keyword",
              "while_keyword",
              "catch_keyword",
              "finally_keyword",
          ],
          within: [
              "index_access_brackets",
              "grouping_parentheses",
              "function_declaration_parentheses",
              "function_call_parentheses",
              "if_parentheses",
              "for_parentheses",
              "while_parentheses",
              "switch_parentheses",
              "catch_parentheses",
              "object_literal_braces",
              "es6_import_or_export_braces",
              "array_brackets",
              "interpolation_expressions",
          ],
          in_ternary_operator: [
              'before_?',
              'after_?',
              'before_:',
              'after_:',
          ],
          other: [
              "before_comma",
              "after_comma",
              "before_for_semicolon",
              "before_property_name_value_separator",
              "after_property_name_value_separator",
              'after_..._in_rest_or_spread',
              'before_*_in_generator',
              'after_*_in_generator',
          ],
      },
      sourceCode: `
import { Component } from 'react'

export class Greeter {
    greetNTimes (to, {from, times}) {
        return range(times).map(item => this.greet(to, from))
    }
}

export class ConsoleGreeter extends Greeter {
    greet (to, from) {
        return \`Hello, \${to} from \${from.join(',')}\`
    }
}

export class ReactGreeter extends Greeter {
    greet (to, from) {
        return (<div className="greeting">
            Hello, {to} from
            {from.map(name => <Name>{name}</Name>)}
        </div>)
    }
}

new ConsoleGreeter().greetNTimes('World', {name: ['Webstorm'], times: 3})

function* fibonacci (current = 1, next = 1) {
    yield current;
    yield* fibonacci(next, current + next);
}

let [first, second, ...rest] = take(fibonacci(), 10)

function foo (x, y, z) {
    var i = 0;
    var x = {0: "zero", 1: "one"};
    var a = [0, 1, 2];
    var foo = function () {
    }
    var asyncFoo = async (x, y, z) => {
    }
    var v = x.map(s => s.length);
    if (!i > 10) {
        for (var j = 0; j < 10; j++) {
            switch (j) {
                case 0:
                    value = "zero";
                    break;
                case 1:
                    value = "one";
                    break;
            }
            var c = j > 5 ? "GT 5" : "LE 5";
        }
    } else {
        var j = 0;
        try {
            while (j < 10) {
                if (i == j || j > 5) {
                    a[j] = i + j * 12;
                }
                i = (j << 2) & 4;
                j++;
            }
            do {
                j--;
            } while (j > 0)
        } catch (e) {
            alert("Failure: " + e.message);
        } finally {
            reset(a, i);
        }
    }
}
`
,
      checkList: [
      // before_parentheses
      "function_declaration", "if", "for", "while", "switch", "catch", "function_expression", "async_arrow_function",
      // around_operator
      "assignment_operator", "logical_operator", "equality_operator", "relational_operator", "bitwise_operator", "additive_operator", "multiplicative_operator", "shift_operators", "arrow_function",
      // before_left_brace
      "function_left_brace", "if_left_brace", "else_left_brace", "for_left_brace", "while_left_brace", "do_left_brace", "switch_left_brace", "try_left_brace", "catch_left_brace", "finally_left_brace", "class_left_brace",
      // before_keywords
      "else_keyword", "while_keyword", "catch_keyword", "finally_keyword",
      // within
      "es6_import_or_export_braces",
      // in_ternary_operator
      "before_?", "after_?", "before_:", "after_:",
      // other
      "after_comma"
      ],
      ast: null,
      newCode: ''
    })

    const { indentConfig, spaceConfig, sourceCode, checkList, ast, newCode } = toRefs(state)

    const log = console.log.bind(console)
    const parse = (code) => {
        let ast = espree.parse(code, {
            ecmaVersion: "latest",
            // 指定要解析的脚本类型（“script”、“module”或“commonjs”）
            sourceType: "module",
            range: true,
            comments: true,
            attachComment: true,
            tokens: true,
            tolerant: true,
            ecmaFeatures: {
                // 启用 JSX 解析
                jsx: true,
                globalReturn: true
            }
        })
        return ast
    }

    const getConfig = () => {
      let s = codeGen(state.ast)
      s = `${s}`
      state.newCode = s
    }

    const fillIndent = (count) => {
      // padStart 是在字符串前补全长度的方法，默认用空格补全
      return ''.padStart(count)
    }
    // 判断是否加空格
    const toggleSpace = (config) => {
      let s = state.checkList.includes(config) ? ' ' : ''
      return s
    }

    // 判断当前节点 indentCount 总数
    const initIndentCount = (indentCount) => {
      return indentCount === 0 ? 1 : indentCount + 1
    }

    // 处理 class 里的 body 的缩进逻辑
    const classAddIndent = (body, indentCount) => {
      // 此时 body 的 type 为 'ClassBody'，由 AST 可知 'ClassBody' 需要缩进
      body.indentCount = initIndentCount(indentCount)
      // 由 AST 可知，'ClassBody' 的 body 是数组，需要遍历里面内容
      let childBody = body.body
      childBody.forEach(item => {
        // 此时 b 的 type 为 'BlockStatement'，需要缩进
        let b = item.value.body
        b.indentCount = body.indentCount + 1
        // 'BlockStatement' 里的内容就递归调用 astAddIndentCount 计算
        astAddIndentCount(b.body, b.indentCount)
      })
    }

    // 处理 if 里的 body 的缩进逻辑
    const ifAddIndent = (node, indentCount) => {
      let alternate = node.alternate
      let consequent = node.consequent
      consequent.indentCount = initIndentCount(indentCount)
      let body = consequent.body
      if (body.length) {
        astAddIndentCount(body, consequent.indentCount)
      }
      if (alternate) {
        if (alternate.type === 'BlockStatement') {
          alternate.indentCount = initIndentCount(indentCount)
          let b = alternate.body
          if (b.length) {
            astAddIndentCount(b, alternate.indentCount)
          }
        } else if (alternate.type === 'IfStatement') {
          ifAddIndent(alternate, indentCount)
        }
      }
    }

    // 为 ast 增加 indentCount 字段以计算每行缩进总数
    const astAddIndentCount = (astBody, indentCount = 0) => {
      astBody.forEach(item => {
        let type = item.type
        // 当节点 type 为 'ExportNamedDeclaration' 时，declaration.body 即是 'ClassBody'
        if (type === 'ExportNamedDeclaration') {
          let declaration = item.declaration
          classAddIndent(declaration.body, indentCount)
        } else if (type === 'ClassDeclaration') {
          classAddIndent(item, indentCount)
        } else if (type === 'FunctionDeclaration') {
          let body = item.body
          if (body != undefined) {
            body.indentCount = initIndentCount(indentCount)
            let b = body.body
            if (b.length) {
              astAddIndentCount(b, body.indentCount)
            }
          }
        } else if (type === 'VariableDeclaration') {
          let declarations = item.declarations
          if (declarations.length) {
            declarations.forEach(d => {
              if(d.init) {
                let body = d.init.body
                if (body) {
                  body.indentCount = initIndentCount(indentCount)
                  let b = body.body
                  if(b.length) {
                    astAddIndentCount(b, indentCount)
                  }
                }
              }
            })
          }
        } else if (type === 'IfStatement') {
          ifAddIndent(item, indentCount)
        } else if (type === 'ForStatement') {
              let body = item.body
              if (body) {
                body.indentCount = initIndentCount(indentCount)
                let b = body.body
                if (b.length) {
                    astAddIndentCount(b, body.indentCount)
                }
              }
        } else if (type === 'SwitchStatement') {
            item.indentCount = initIndentCount(indentCount)
          let cases = item.cases
          if (cases.length) {
              astAddIndentCount(cases, item.indentCount)
          }
        } else if (type === 'SwitchCase') {
            item.indentCount = initIndentCount(indentCount)
            let consequent = item.consequent
            if (consequent.length) {
                astAddIndentCount(consequent, item.indentCount)
            }
        } else if (type === 'TryStatement') {
          let block = item.block
          block.indentCount = initIndentCount(indentCount)
          let body = block.body
          if (body.length) {
            astAddIndentCount(body, block.indentCount)
          }
          let handler = item.handler
          let hb = handler.body
          hb.indentCount = initIndentCount(indentCount)
          let hcb = hb.body
          if (hcb.length) {
            astAddIndentCount(hcb, hb.indentCount)
          }
          let finalizer = item.finalizer
          finalizer.indentCount = initIndentCount(indentCount)
          let fb = finalizer.body
          if (fb.length) {
            astAddIndentCount(fb, finalizer.indentCount)
          }
        } else if (type === 'WhileStatement') {
          let body = item.body
          body.indentCount = initIndentCount(indentCount)
          let b = body.body
          if (b.length) {
            astAddIndentCount(b, body.indentCount)
          }
        } else if (type === 'DoWhileStatement') {
          let body = item.body
          body.indentCount = initIndentCount(indentCount)
          let b = body.body
          if (b.length) {
            astAddIndentCount(b, body.indentCount)
          }
        }
      })
      // log('astBody',astBody)
    }

    // 判断 BinaryExpression 是否需要加括号
    const astAddParentheses = (ast) => {
      let tokens = ast.tokens.filter(e => e.value === '(')
      log('tokens',tokens)
      // 获取每个左括号起始位置和结束位置的数组
      let list = tokens.map(e => ({
        start: e.start,
        end: e.end
      }))
      log('list',list)
      ast.body.forEach(body => {
        traverseNodes(body)
      })
    }

    // 遍历子节点
    const traverseNodes = (node) => {
      if (node.hasChildNodes) {
        let childNodes = node.childNodes
        childNodes.forEach(child => {
          if (child.type === 'BinaryExpression') {
            processParentheses(child)
          }
          traverseNodes(child)
        })
      } else {
        return node
      }
    }

    // 给需要加括号的节点添加标记
    const processParentheses = (node) => {
      log('process',node)
      // if (node.type === 'BinaryExpression') {
      //   log('BinaryExpression')
      // }
      // if (node.hasChildNode

    }

    const typeMap = {
      Program(node) {
        let body = node.body
        let s = body.map(b => codeGen(b)).join('\n\n')
        return s
      },
      ImportDeclaration(node) {
        let specifiers = node.specifiers
        let source = node.source
        // 引入用逗号分隔，所以返回结果 join(',')
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let s = specifiers.map(s => codeGen(s)).join(`${before_comma},${after_comma}`)
        let v = codeGen(source)
        // 检查是否勾选对应选项
        let es6_import_or_export_braces_space = toggleSpace('es6_import_or_export_braces')
        // 拼接返回内容
        let r = `import {${es6_import_or_export_braces_space}${s}${es6_import_or_export_braces_space}} from ${v}`
        return r
      },
      ImportSpecifier(node) {
        let imported = node.imported
        let name = codeGen(imported)
        return name
      },
      Identifier(node) {
        return node.name
      },
      Literal(node) {
        return node.raw
      },
      JSXText(node) {
        return node.raw
      },
      ExportNamedDeclaration(node) {
        let declaration = node.declaration
        let s
        let r
        if(declaration) {
          s = codeGen(declaration)
          r = `export ${s}`
        }
        return r
      },
      ClassDeclaration(node) {
        let id = node.id
        let body = node.body
        let superClass = node.superClass
        let name = codeGen(id)
        let s = codeGen(body)
        let sc = ''
        if (superClass) {
          sc = codeGen(superClass)
        }
        let class_left_brace = toggleSpace('class_left_brace')
        let r = sc ? `class ${name} extends ${sc}${class_left_brace}{\n${s}\n}` : `class ${name}${class_left_brace}{\n${s}\n}`
        return r
      },
      ClassBody(node) {
        let body = node.body
        let startSpace =  fillIndent(state.indentConfig.indent * node.indentCount)
        body = body.map(e=> {
          let b = startSpace + codeGen(e)
          return b
        }).join('\n')
        let r = `${body}`
        return r
      },
      MethodDefinition(node) {
        let key = node.key
        let value = node.value
        let k = codeGen(key)
        let v= codeGen(value, 'MethodDefinition')
        let function_declaration = toggleSpace('function_declaration')
        let r = `${k}${function_declaration}${v}`
        return r
      },
      FunctionExpression(node, parentType) {
        let expression = node.expression
        let generator = node.generator
        let async = node.async
        let params = node.params
        let body = node.body
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let p = params.map(p => codeGen(p)).join(`${before_comma},${after_comma}`)
        let b = codeGen(body)
        let function_expression = toggleSpace('function_expression')
        let function_left_brace = toggleSpace('function_left_brace')
        let function_declaration_parentheses = toggleSpace('function_declaration_parentheses')
        let r = ''
        if (parentType === 'MethodDefinition') {
          r = `(${function_declaration_parentheses}${p}${function_declaration_parentheses})${function_left_brace}${b}`
        } else {
          r = `function${function_expression}(${function_declaration_parentheses}${p}${function_declaration_parentheses})${function_left_brace}${b}`
        }
        return r
      },
      ObjectPattern(node) {
        let properties = node.properties
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let p = properties.map(p => codeGen(p)).join(`${before_comma},${after_comma}`)
        let object_literal_braces = toggleSpace('object_literal_braces')
        let r = `{${object_literal_braces}${p}${object_literal_braces}}`
        return r
      },
      Property(node) {
        let key = node.key
        let value = node.value
        let k = codeGen(key)
        let v = codeGen(value)
        let before_property_name_value_separator = toggleSpace('before_property_name_value_separator')
        let after_property_name_value_separator = toggleSpace('after_property_name_value_separator')
        let r = k === v ? `${k}` : `${k}${before_property_name_value_separator}:${after_property_name_value_separator}${v}`
        return r
      },
      BlockStatement(node) {
        let body = node.body
        let startSpace =  fillIndent(state.indentConfig.indent * node.indentCount)
        let endSpace = fillIndent(state.indentConfig.indent * (node.indentCount - 1))
        let b = body.length ? body.map(b => {
          return startSpace + codeGen(b)
        }).join('\n') + '\n': ''
        let r = `{\n${b}${endSpace}}`
        return r
      },
      ReturnStatement(node) {
        let argument = node.argument
        let a = codeGen(argument)
        let r = `return ${a}`
        return r
      },
      JSXElement(node) {
        let openingElement = node.openingElement
        let closingElement = node.closingElement
        let children = node.children
        let open = codeGen(openingElement)
        let close = codeGen(closingElement) 
        let c = children.map(c => codeGen(c)).join('')
        let grouping_parentheses = toggleSpace('grouping_parentheses')
        let r = `(${grouping_parentheses}${open}${c}${close}${grouping_parentheses})`
        return r
      },
      JSXOpeningElement(node) {
        let attributes = node.attributes
        let name = node.name
        let a = attributes.map(a => codeGen(a)).join(' ') || ''
        let n = codeGen(name)
        let as = a ? ` ${a}` : ''
        let r = node.selfClosing ? `<${n}${as} />` : `<${n}${as}>`
        return r
      },
      JSXAttribute(node) {
        let name = node.name
        let value = node.value
        let n = codeGen(name)
        let v = codeGen(value)
        let r = `${n}=${v}`
        return r
      },
      JSXIdentifier(node) {
        return node.name
      },
      JSXClosingElement(node) {
        let name = node.name
        let n = codeGen(name)
        let r = `</${n}>`
        return r
      },
      JSXExpressionContainer(node) {
        let expression = node.expression
        let e = codeGen(expression)
        let interpolation_expressions = toggleSpace('interpolation_expressions')
        let r = `{${interpolation_expressions}${e}${interpolation_expressions}}`
        return r
      },
      TemplateLiteral(node) {
        let expressions = node.expressions
        let quasis = node.quasis
        let e = expressions.map(e => codeGen(e))
        let q = quasis.map(q => codeGen(q))
        // e 拼接一个空字符串，用于遍历 quasis
        e.concat('')
        let s = ''
        let interpolation_expressions = toggleSpace('interpolation_expressions')
        for (let i = 0; i < e.length; i++) {
          s += q[i] + '${'+ interpolation_expressions + e[i] + interpolation_expressions +'}'
        }
        let r = `\`${s}\``
        return r
      },
      TemplateElement(node) {
        return node.value.raw
      },
      CallExpression(node) {
        let callee = node.callee
        let args = node.arguments
        let c = codeGen(callee)
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let a = args.map(a => codeGen(a)).join(`${before_comma},${after_comma}`)
        let function_call = toggleSpace('function_call')
        let function_call_parentheses = toggleSpace('function_call_parentheses')
        let r = `${c}${function_call}(${function_call_parentheses}${a}${function_call_parentheses})`
        return r
      },
      ArrowFunctionExpression(node) {
        let params = node.params
        let body = node.body
        let async = node.async
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let p = params.map(p => codeGen(p)).join(`${before_comma},${after_comma}`)
        let b = codeGen(body)
        let async_arrow_function = toggleSpace('async_arrow_function')
        let arrow_function = toggleSpace('arrow_function')
        let r = `${async?'async'+async_arrow_function:''}${params.length>1?'('+p+')':p}${arrow_function}=>${arrow_function}${b}`
        return r
      },
      MemberExpression(node) {
        let object = node.object
        let property = node.property
        let computed = node.computed
        let o = codeGen(object)
        let p = codeGen(property)
        let index_access_brackets = toggleSpace('index_access_brackets')
        let r = computed ? `${o}[${index_access_brackets}${p}${index_access_brackets}]`:`${o}.${p}`
        return r
      },
      ThisExpression(node) {
        return 'this'
      },
      VariableDeclaration(node) {
        let declarations = node.declarations
        let kind = node.kind
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let d = declarations.map(d => codeGen(d)).join(`${before_comma},${after_comma}`)
        let r = `${kind} ${d}`
        return r
      },
      VariableDeclarator(node) {
        let id = node.id
        let init = node.init
        let name = codeGen(id)
        let i = codeGen(init, 'VariableDeclarator')
        let r = `${name} = ${i}`
        return r
      },
      BinaryExpression(node) {
        let left = node.left
        let operator = node.operator
        let right = node.right
        let l = codeGen(left)
        let r = codeGen(right)
        let binary_operator = ''
        if (['==','!=','===','!=='].includes(operator)) {
          binary_operator = toggleSpace('equality_operator')
        } else if (['<', '>', '<=', '>='].includes(operator)) {
          binary_operator = toggleSpace('relational_operator')
        } else if (['%', '|', '^'].includes(operator)) {
          binary_operator = toggleSpace('bitwise_operator')
        } else if (['+', '-'].includes(operator)) {
          binary_operator = toggleSpace('additive_operator')
        } else if (['*', '/', '%'].includes(operator)) {
          binary_operator = toggleSpace('multiplicative_operator')
        } else if (['<<', '>>', '>>>'].includes(operator)) {
          binary_operator = toggleSpace('shift_operators')
        }
        let s = `${l}${binary_operator}${operator}${binary_operator}${r}`
        return s
      },
      ExpressionStatement(node) {
        let expression = node.expression
        let e = codeGen(expression)
        return e
      },
      NewExpression(node) {
        let callee = node.callee
        let args = node.arguments
        let c = codeGen(callee)
        let a = args.length ? codeGen(args) : ''
        let r = `new ${c}(${a})`
        return r
      },
      ObjectExpression(node) {
        let properties = node.properties
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let p = properties.map(p => codeGen(p)).join(`${before_comma},${after_comma}`)
        let r = `{${p}}`
        return r
      },
      ArrayExpression(node) {
        let elements = node.elements
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let e = elements.map(e => codeGen(e)).join(`${before_comma},${after_comma}`)
        let array_brackets = toggleSpace('array_brackets')
        let r = `[${array_brackets}${e}${array_brackets}]`
        return r
      },
      FunctionDeclaration(node) {
        let id = node.id
        let expression = node.expression
        let generator = node.generator
        let async = node.async
        let params = node.params
        let body = node.body
        let name = codeGen(id)
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let p = params.map(p => codeGen(p)).join(`${before_comma},${after_comma}`)
        let b = codeGen(body)
        let before = toggleSpace('before_*_in_generator')
        let after = toggleSpace('after_*_in_generator')
        let r = `function${generator?before+'*'+after:' '}${name}(${p})${b}`
        return r
      },
      AssignmentPattern(node) {
        let left = node.left
        let right = node.right
        let l = codeGen(left)
        let r = codeGen(right)
        let assignment_operator = toggleSpace('assignment_operator')
        let s = `${l}${assignment_operator}=${assignment_operator}${r}`
        return s
      },
      ExpressionStatement(node) {
        let expression = node.expression
        let e = codeGen(expression)
        let r = `${e}`
        return r
      },
      YieldExpression(node) {
        let args = node.argument
        let delegate = node.delegate
        let a = codeGen(args)
        let r = `yield${delegate?'*':''} ${a}`
        return r
      },
      ArrayPattern(node) {
        let elements = node.elements
        let before_comma = toggleSpace('before_comma')
        let after_comma = toggleSpace('after_comma')
        let e = elements.map(e => codeGen(e)).join(`${before_comma},${after_comma}`)
        let r = `[${e}]`
        return r 
      },
      RestElement(node) {
        let arg = node.argument
        let a = codeGen(arg)
        let after = toggleSpace('after_..._in_rest_or_spread')
        let r = `...${after}${a}`
        return r
      },
      SpreadElement(node) {
        let arg = node.argument
        let a = codeGen(arg)
        let r = `...${a}`
        return r
      },
      IfStatement(node) {
        let test = node.test
        let consequent = node.consequent
        let alternate = node.alternate
        let t = codeGen(test)
        let c = codeGen(consequent)
        let a = alternate ? codeGen(alternate) : ''
        let if_space = toggleSpace('if')
        let if_left_brace = toggleSpace('if_left_brace')
        let else_left_brace = toggleSpace('else_left_brace')
        let else_keyword = toggleSpace('else_keyword')
        let if_parentheses = toggleSpace('if_parentheses')
        let r = `if${if_space}(${t})${if_left_brace}${c}${alternate?else_keyword+'else'+else_left_brace+a : ''}`
        return r
      },
      UnaryExpression(node) {
        let operator = node.operator
        let prefix = node.prefix
        let argument = node.argument
        let a = codeGen(argument)
        let before_unary = toggleSpace('before_unary')
        let after_unary = toggleSpace('after_unary')
        let r = `${before_unary}${operator}${after_unary}${a}`
        return r
      },
      ForStatement(node) {
        let init = node.init
        let test = node.test
        let update = node.update
        let body = node.body
        let i = codeGen(init)
        let t = codeGen(test)
        let u = codeGen(update)
        let b = codeGen(body)
        let for_space = toggleSpace('for')
        let for_left_brace = toggleSpace('for_left_brace')
        let for_parentheses = toggleSpace('for_parentheses')
        let before_for_semicolon = toggleSpace('before_for_semicolon')
        let r = `for${for_space}(${for_parentheses}${i}${before_for_semicolon}; ${t}${before_for_semicolon}; ${u}${for_parentheses})${for_left_brace}${b}`
        return r
      },
      UpdateExpression(node) {
        let operator = node.operator
        let prefix = node.prefix
        let argument = node.argument
        let a = codeGen(argument)
        let unary_additive_operators = ''
        if (['+', '-', '++', '--'].includes(operator)) {
          unary_additive_operators = toggleSpace('unary_additive_operators')
        }
        let r = `${a}${unary_additive_operators}${operator}`
        return r
      },
      SwitchStatement(node) {
        let discriminant = node.discriminant
        let cases = node.cases
        let startSpace =  fillIndent(state.indentConfig.indent * node.indentCount)
        let endSpace = fillIndent(state.indentConfig.indent * (node.indentCount - 1))
        let d = codeGen(discriminant)
        let c = cases.map(c => {
          return startSpace + codeGen(c)
        }).join('\n')
        let switch_space = toggleSpace('switch')
        let switch_left_brace = toggleSpace('switch_left_brace')
        let switch_parentheses = toggleSpace('switch_parentheses')
        let r = `switch${switch_space}(${switch_parentheses}${d}${switch_parentheses})${switch_left_brace}{\n${c}\n${endSpace}}`
        return r
      },
      SwitchCase(node) {
        let consequent = node.consequent
        let test = node.test
        let startSpace =  fillIndent(state.indentConfig.indent * node.indentCount)
        let c = consequent.map(c => {
          return startSpace + codeGen(c)
        }).join('\n')
        let t = codeGen(test)
        let r = `case ${t}:\n${c}`
        return r
      },
      AssignmentExpression(node) {
        let operator = node.operator
        let left = node.left
        let right = node.right
        let l = codeGen(left)
        let r = codeGen(right)
        let s = `${l}${operator}${r}`
        return s
      },
      BreakStatement(node) {
        return 'break'
      },
      ConditionalExpression(node) {
        let test = node.test
        let consequent = node.consequent
        let alternate = node.alternate
        let t = codeGen(test)
        let c = codeGen(consequent)
        let a = codeGen(alternate)
        let before_q = toggleSpace('before_?')
        let after_q = toggleSpace('after_?')
        let before_c = toggleSpace('before_:')
        let after_c = toggleSpace('after_:')
        let r = `${t}${before_q}?${after_q}${c}${before_c}:${after_c}${a}`
        return r
      },
      TryStatement(node) {
        let block = node.block
        let handler = node.handler
        let finalizer = node.finalizer
        let b = codeGen(block)
        let h = codeGen(handler)
        let f = codeGen(finalizer)
        let try_left_brace = toggleSpace('try_left_brace')
        let finally_left_brace = toggleSpace('finally_left_brace')
        let finally_keyword = toggleSpace('finally_keyword')
        let r = `try${try_left_brace}${b}${h}${finally_keyword}finally${finally_left_brace}${f}`
        return r
      },
      WhileStatement(node) {
        let test = node.test
        let body = node.body
        let t = codeGen(test)
        let b = codeGen(body)
        let while_space = toggleSpace('while')
        let while_left_brace = toggleSpace('while_left_brace')
        let while_parentheses = toggleSpace('while_parentheses')
        let r = `while${while_space}(${while_parentheses}${t}${while_parentheses})${while_left_brace}${b}`
        return r
      },
      DoWhileStatement(node) {
        let test = node.test
        let body = node.body
        let t = codeGen(test)
        let b = codeGen(body)
        let while_space = toggleSpace('while')
        let do_left_brace = toggleSpace('do_left_brace')
        let while_keyword = toggleSpace('while_keyword')
        let r = `do${do_left_brace}${b}${while_keyword}while${while_space}(${t})`
        return r
      },
      CatchClause(node) {
        let param = node.param
        let body = node.body
        let p = codeGen(param)
        let b = codeGen(body)
        let catch_space = toggleSpace('catch')
        let catch_left_brace = toggleSpace('catch_left_brace')
        let catch_keyword = toggleSpace('catch_keyword')
        let catch_parentheses = toggleSpace('catch_parentheses')
        let r = `${catch_keyword}catch${catch_space}(${catch_parentheses}${p}${catch_parentheses})${catch_left_brace}${b}`
        return r
      },
      LogicalExpression(node) {
        let operator = node.operator
        let left = node.left
        let right = node.right
        let l = codeGen(left)
        let r = codeGen(right)
        let logical_operator = toggleSpace('logical_operator')
        let s = `${l}${logical_operator}${operator}${logical_operator}${r}`
        return s
      }
    }

    const codeGen = (node, parent) => {
      let type = node.type
      // log('type',type)
      let result = ''
      result = typeMap[type] && typeMap[type](node, parent)
      return result
    }

    onMounted(() => {
      state.ast = parse(state.sourceCode)
      astAddIndentCount(state.ast.body)
      astAddParentheses(state.ast)
      let s = codeGen(state.ast)
      s = `${s}`
      state.newCode = s
      // log('state.newCode',state.newCode)
    })

    return {
      indentConfig,
      spaceConfig,
      sourceCode,
      checkList,
      ast,
      newCode,
      log,
      parse,
      getConfig,
      fillIndent,
      toggleSpace,
      initIndentCount,
      classAddIndent,
      ifAddIndent,
      astAddIndentCount,
      astAddParentheses,
      processParentheses,
      typeMap,
      codeGen
    }
  },
  components: {
    ElInputNumber,
    ElCheckboxGroup,
    ElCheckbox
  },
}
</script>
<style scoped>
.main {
  display: flex;
  height: 95vh;
}
.options {
  color: #333;
  width: 15%;
  overflow-y: auto;
  border: 1px solid #333;
  margin-right: 10px;
  padding: 10px;
}
.options .block {
  display: flex;
  flex-direction: column;
}
.indent {
  display: flex;
  align-items: center;
}
.category {
  font-size: 18px;
  font-weight: bold;
  margin-right: 1rem;
}
.source textarea {
  width: 100%;
  height: 100%;
  border: none;
}
.panel, .source {
  overflow: scroll;
  border: 1px solid #333;
  margin-right: 10px;
}
.panel {
  width: 45%;
}
.source {
  width: 40%;
}
pre {
  margin: 0;
}
</style>
