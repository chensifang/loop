// 表格结构数据 - 由 client.ts 在找到容器后直接调用 renderTableStructure

// RunLoop 核心数据结构
export const runLoopData = {
  blocks: [
    {
      id: 'cfrunloop',
      title: 'CFRunLoop',
      rows: [
        { offset: '_commonModes' },
        { offset: '_commonModeItems' },
        { offset: '_currentMode', linkTo: 'cfrunloopmode' },
        { offset: '_modes', linkTo: 'cfrunloopmode' },
      ],
    },
    {
      id: 'cfrunloopmode',
      title: 'CFRunLoopMode',
      rows: [
        { offset: '_name' },
        { offset: '_sources0', linkTo: 'source0' },
        { offset: '_sources1', linkTo: 'source1' },
        { offset: '_timers', linkTo: 'timer' },
        { offset: '_observers', linkTo: 'observer' },
      ],
    },
    {
      id: 'source0',
      title: 'CFRunLoopSourceRef (Source0)',
      rows: [],
    },
    {
      id: 'source1',
      title: 'CFRunLoopSourceRef (Source1)',
      rows: [],
    },
    {
      id: 'timer',
      title: 'CFRunLoopTimerRef',
      rows: [],
    },
    {
      id: 'observer',
      title: 'CFRunLoopObserverRef',
      rows: [],
    },
  ],
}

export const memoryData = {
  blocks: [
    {
      id: 'dog-structure',
      title: 'Dog 对象内存布局',
      rows: [
        { offset: '偏移 0', name: 'isa', type: '指针', size: '8 字节', linkTo: 'isa-structure' },
        { offset: '偏移 8', name: '_name', type: 'NSString *', size: '8 字节' },
        { offset: '偏移 16', name: '_age', type: 'int', size: '4 字节' },
        { offset: '偏移 20', desc: '对齐填充', size: '4 字节' },
      ],
    },
    {
      id: 'isa-structure',
      title: 'isa 指针结构（NONPOINTER_ISA）',
      rows: [
        { offset: '位 0', name: 'nonpointer', size: '1=存储额外信息' },
        { offset: '位 1', name: 'has_assoc', size: '是否有关联对象' },
        { offset: '位 2', name: 'has_cxx_dtor', size: '是否有C++析构函数' },
        { offset: '位 3-35', name: 'shiftcls', size: '类对象地址（33位）' },
        { offset: '位 36-47', name: 'magic', size: '魔数（用于验证）' },
        { offset: '位 48', name: 'weakly_referenced', size: '是否有弱引用' },
        { offset: '位 49', name: 'deallocating', size: '是否正在释放' },
        { offset: '位 50', name: 'has_sidetable_rc', size: '引用计数是否在SideTable' },
        { offset: '位 51-63', name: 'extra_rc', size: '额外引用计数（19位）' },
      ],
    },
  ],
}

// 三种实体（实例对象、类对象、元类对象）内部结构
export const entityStructureData = {
  blocks: [
    {
      id: 'instance',
      title: '实例对象（Instance）',
      subtitle: 'struct objc_object，实际创建的对象',
      headers: [
        { type: 'offset', text: '偏移' },
        { type: 'content', text: '内容' },
        { type: 'size', text: '说明' },
      ],
      rows: [
        { offset: '0', name: 'isa', type: '指针', size: '指向类对象', linkTo: 'class' },
        { offset: '8', desc: '实例变量 1', size: '父类 ivar' },
        { offset: '...', desc: '实例变量 2、3...', size: '本类 ivar' },
      ],
    },
    {
      id: 'class',
      title: '类对象（Class）',
      subtitle: 'struct objc_class，描述实例的结构',
      headers: [
        { type: 'offset', text: '偏移' },
        { type: 'content', text: '字段' },
        { type: 'size', text: '说明' },
      ],
      rows: [
        { offset: '0', name: 'isa', type: '指针', size: '指向元类对象', linkTo: 'metaclass' },
        { offset: '8', name: 'superclass', type: '指针', size: '指向父类对象' },
        { offset: '16', name: 'cache', type: 'objc_cache', size: '方法缓存，加速查找' },
        { offset: '24', name: 'bits', type: '指针', size: '指向 class_rw_t', linkTo: 'class-rw' },
      ],
    },
    {
      id: 'metaclass',
      title: '元类对象（Meta-class）',
      subtitle: 'struct objc_class，描述类对象的结构',
      headers: [
        { type: 'offset', text: '偏移' },
        { type: 'content', text: '字段' },
        { type: 'size', text: '说明' },
      ],
      rows: [
        { offset: '0', name: 'isa', type: '指针', size: '指向根元类（或自身）' },
        { offset: '8', name: 'superclass', type: '指针', size: '指向父元类（根元类→根类）' },
        { offset: '16', name: 'cache', type: 'objc_cache', size: '类方法缓存' },
        { offset: '24', name: 'bits', type: '指针', size: '类方法列表等' },
      ],
    },
    {
      id: 'class-rw',
      title: 'class_rw_t（bits 指向）',
      subtitle: '类对象中的方法、属性、协议等',
      headers: [
        { type: 'offset', text: '内容' },
        { type: 'size', text: '说明' },
      ],
      rows: [
        { offset: 'method_list_t', size: '实例方法列表' },
        { offset: 'property_list_t', size: '属性列表' },
        { offset: 'protocol_list_t', size: '协议列表' },
        { offset: 'class_ro_t', size: '只读数据（类名、ivar 布局等）' },
      ],
    },
  ],
}

export const sideTableData = {
  blocks: [
    {
      id: 'stripedmap',
      title: 'StripedMap<SideTable>',
      subtitle: '模板类：全局容器，包含64个SideTable的数组，通过对象地址哈希选择',
      headers: [
        { type: 'offset', text: '字段名' },
        { type: 'size', text: '类型/说明' },
      ],
      rows: [
        { offset: 'array', size: 'SideTable[64] - 固定大小数组，包含64个SideTable对象', linkTo: 'sidetable' },
        { offset: 'count', size: 'static const size_t = 64（静态常量：数组大小）' },
        { offset: 'get(p)', size: '方法：根据指针p计算索引，返回array[index]的引用' },
      ],
    },
    {
      id: 'sidetable',
      title: 'SideTable',
      rows: [
        { offset: 'refcnts', size: '引用计数表', linkTo: 'refcountmap' },
        { offset: 'weak_table', size: 'weak表', linkTo: 'weaktable' },
      ],
    },
    {
      id: 'refcountmap',
      title: 'refcnts（引用计数表）',
      headers: [
        { type: 'offset', text: 'Key（对象地址）' },
        { type: 'size', text: 'Value（引用计数）' },
      ],
      rows: [
        { offset: '0x1', size: '3' },
        { offset: '0x2', size: '5' },
      ],
    },
    {
      id: 'weaktable',
      title: 'weak_table（weak表）',
      rows: [
        { offset: 'weak_entries', size: '指向 weak_entry_t 数组的指针', linkTo: 'weakentries' },
        { offset: 'num_entries', size: '条目数量 = 2' },
        { offset: 'mask', size: '哈希表的掩码' },
        { offset: 'max_hash_displacement', size: '最大哈希位移' },
      ],
    },
    {
      id: 'weakentries',
      title: 'weak_entries 数组',
      rows: [
        { offset: 'weak_entry_t[0]', size: '对象p1的weak引用', linkTo: 'weakentry0' },
        { offset: 'weak_entry_t[1]', size: '对象p2的weak引用', linkTo: 'weakentry1' },
      ],
    },
    {
      id: 'weakentry0',
      title: 'weak_entry_t[0]（对象p1）',
      rows: [
        { offset: 'referent', size: 'DisguisedPtr<objc_object> - 对象地址 = 0x1（对象p1地址）' },
        { offset: 'inline_referrers', size: 'WEAK_INLINE_COUNT - 内联数组（存储 weak 指针地址）' },
        { offset: 'referrers', size: 'weak_referrer_t* - 动态分配的数组（当内联不够时）' },
        { offset: 'out_of_line', size: 'uintptr_t - 标志位：是否使用动态数组' },
        { offset: 'num_refs', size: 'uintptr_t - weak 引用数量' },
      ],
    },
    {
      id: 'weakentry1',
      title: 'weak_entry_t[1]（对象p2）',
      rows: [{ offset: '', size: '同上' }],
    },
  ],
}
