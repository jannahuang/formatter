<template>
  <div class="main">
    <!-- 格式化选项 -->
    <div class="options">
      <div class="op-list" v-for="(value, name, index) in spaceConfig" :key="index">
        <div class="op-title" data-action="toggle-item">
          {{name}}
          <span class="op-arrow" data-action="toggle-item">-</span>
        </div>
        <div class="op-block">
          <div class="op-item" v-for="(v, n, i) in value" :key="i">
            <label>
              <input type="checkbox" :data-parent="value" :data-action="n" :checked="v">
              <span class="op-text">{{n}}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <!-- 格式化效果 -->
    <div class="panel">
      3333
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue"
export default {
  setup() {
    const testFunction = () => {
      console.log('!!!')
    }
    const indentConfig = {
        indent: 4,
    }
    const spaceConfig = {
        before_parentheses: {
            // 函数定义
            function_declaration: false,
            // 函数调用
            function_call: false,
            if: true,
            for: true,
            while: true,
            switch: false,
            catch: true,
            function_expression: true,
            async_arrow_function: false,
        },
        around_operator: {
            // =, +=, -=
            assignment_operator: true,
            // &&, ||
            logical_operator: true,
            // ==, !=, '===', '!=='
            equality_operator: true,
            // <, >, <=
            relational_operator: true,
            // &, |, ^
            bitwise_operator: true,
            // +, -,
            additive_operator: true,
            // *, /, %
            multiplicative_operator: true,
            // <<, >>, >>>
            shift_operators: true,
            // +, -, ++, --
            unary_additive_operators: true,
            // =>
            arrow_function: true,
            // !, !!
            before_unary: false,
            // !, !!
            after_unary: false,
        },
        before_left_brace: {
            function_left_brace: true,
            if_left_brace: true,
            else_left_brace: true,
            for_left_brace: true,
            while_left_brace: true,
            do_left_brace: true,
            switch_left_brace: true,
            try_left_brace: true,
            catch_left_brace: true,
            finally_left_brace: true,
            class_left_brace: true,
        },
        before_keywords: {
            else_keyword: true,
            while_keyword: true,
            catch_keyword: true,
            finally_keyword: true,
        },
        within: {
            index_access_brackets: false,
            grouping_parentheses: false,
            function_declaration_parentheses: false,
            function_call_parentheses: false,
            if_parentheses: false,
            for_parentheses: false,
            while_parentheses: false,
            switch_parentheses: false,
            catch_parentheses: false,
            object_literal_braces: true,
            es6_import_or_export_braces: true,
            array_brackets: false,
            interpolation_expressions: false,
        },
        in_ternary_operator: {
            'before_?': false,
            'after_?': false,
            'before_:': false,
            'after_:': false,
        },
        other: {
            before_comma: false,
            after_comma: true,
            before_for__semicolon: false,
            before_property_name_value_separator: false,
            after_property_name_value_separator: true,
            'after_..._in_rest_or_spread': false,
            'before_*_in_generator': false,
            'after_*_in_generator': true,
        },
    }

    onMounted(() => {

    })

    return {
      testFunction,
      indentConfig,
      spaceConfig
    }
  }
}
</script>
<style scoped>
.main {
  display: flex;
  height: 90vh;
}
.options {
  color: #333;
  width: 700px;
  overflow-y: auto;
}
.panel {
  width: 1000px;
  overflow: scroll;
}
</style>
