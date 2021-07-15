import React, { memo, useEffect, useCallback, useState, useRef } from 'react';
// import { Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { DagProps } from './interface'
import './dag.scss'

const DefaultDag: React.FC<DagProps> = (props: DagProps) => {
    const { dataSource = [], config } = props
    const [sourceDom, setSourceDom] = useState<JSX.Element[] | null>(null)
    const [sourceStyle, setSourceStyle] = useState<any>({})
    const dagWrap = useRef(null)

    const getCurrentNextIcon = useCallback((commonConfig: any, currentItem: any, isShow: boolean) => {
        if (!isShow) {
            return null
        }
        const { nextIcon } = commonConfig
        return currentItem.nextIcon !== undefined ? currentItem.nextIcon : nextIcon !== undefined ? nextIcon : null
    }, [])

    const baseNextIconMarginTopForLeft = useCallback((haveChildren: boolean, commonConfig: any) => {
        const { baseHeight, spaceForTB } = commonConfig
        const spaceTB = (baseHeight + spaceForTB) / 2
        return `${haveChildren ? baseHeight - (baseHeight / 2) : spaceTB}px`
    }, [])

    const renderSource = useCallback((list: Array<any>) => {
        if (list && list.length) {
            const { base, common } = config
            const bgColor = common.lineColor || '#000'
            return list.map((item: any, index: number) => {
                const { children } = item
                const currentNextIcon = getCurrentNextIcon(common, item, list.length !== index + 1)
                const getChildrenLength = children && children.length || 0

                const _transHeight = (common.spaceForTB + common.baseHeight) / 2 * (getChildrenLength ? (getChildrenLength > 3 ? 3 : getChildrenLength) - 1 : 0)

                const listStyle: any = {}
                const baseWrapStyle: any = {}
                const baseHorizontalLinkStyle: any = {
                    background: bgColor
                }
                const baseHorizontalLinkIconStyle: any = {}
                const baseLinkStyle: any = {
                    background: bgColor
                }
                const baseVerticalLinkStyle: any = {
                    background: bgColor
                }
                const baseInnerVerticalLinkStyle: any = {
                    background: bgColor
                }

                const baseNextIconStyle: any = {}

                switch (base.align) {
                    case 'left':
                        Object.assign(listStyle, {
                            margin: `-${_transHeight}px ${common.spaceForLR}px ${getChildrenLength > 1 ? getChildrenLength * common.spaceForTB / 2 : index === 0 && getChildrenLength === 1 ? (common.spaceForTB + common.baseHeight) : 0}px 0`
                        })

                        Object.assign(baseWrapStyle, {
                            marginBottom: `${getChildrenLength ? 0 : common.spaceForTB}px`
                        })

                        Object.assign(baseHorizontalLinkStyle, {
                            width: `${common.spaceForLR / 2}px`,
                            left: `-${common.spaceForLR / 2}px`,
                            top: `${common.baseHeight / 2 - 0.5}px`
                        })

                        Object.assign(baseLinkStyle, {
                            width: `${common.spaceForLR / 2}px`,
                            right: `-${common.spaceForLR / 2}px`,
                            top: `${common.baseHeight / 2 - 0.5}px`
                        })

                        Object.assign(baseVerticalLinkStyle, {
                            height: `${common.baseHeight + common.spaceForTB}px`,
                            top: `${list.length === index + 1 ? -(common.baseHeight + common.spaceForTB) : (list.length - 2 === index && index !== 0) ? -(common.baseHeight / 2) : 0}px`
                        })

                        Object.assign(baseHorizontalLinkIconStyle, {
                            left: '5px',
                            top: `${common.baseHeight / 2}px`,
                        })

                        Object.assign(baseInnerVerticalLinkStyle, {
                            right: `-${common.spaceForLR / 2}px`,
                            top: `${index === 0 ? '' : '-'}${common.baseHeight / 2}px`,
                        })

                        Object.assign(baseNextIconStyle, {
                            top: '50%',
                            transform: `translate(-50%,-50%)`,
                            marginTop: baseNextIconMarginTopForLeft(!!getChildrenLength, common)
                        })
                        break;
                    default:
                        break;
                }

                return (
                    <li key={index} style={baseWrapStyle}>
                        <div className="base-link" style={baseLinkStyle}>
                            {list.length === 1 ? null : <div className="vertical-link" style={baseVerticalLinkStyle} />}
                        </div>
                        <div className="base">
                            <div className="base-next-icon" style={baseNextIconStyle}>{currentNextIcon}</div>
                            {list.length !== index + 1 ? <div className="base-vertical-link" style={baseInnerVerticalLinkStyle} /> : null}
                            {getChildrenLength ? <div className="horizontal-link" style={baseHorizontalLinkStyle} /> : null}
                            {getChildrenLength ? <div className="horizontal-link-icon" style={baseHorizontalLinkIconStyle}><CaretRightOutlined style={{ fontSize: '14px', color: common.lineColor || '#000' }} translate="x" /></div> : null}
                            {base.component(item)}
                        </div>
                        {getChildrenLength ? (
                            <ul className="list" style={listStyle}>
                                {renderSource(children)}
                            </ul>
                        ) : null}
                    </li>
                )
            })
        }
        return null
    }, [config])

    const recursionSource = useCallback((list: Array<any>, parentIndex: string, res: Array<string>) => {
        if (list && list.length) {
            list.forEach((item: any, index: number) => {
                const { children } = item
                res.push(`${parentIndex}_${index}`)
                if (children && children.length) {
                    recursionSource(children, `${parentIndex}_${index}`, res)
                }
            })
        }
    }, [])

    useEffect(() => {
        const getSourceDom = renderSource(dataSource)
        const { base, common } = config
        // 当从左到右排列时 计算横向宽度 & 距离顶部超出的部分
        if (base.align === "left" && dataSource.length) {
            const linkedArr: Array<string> = []

            recursionSource(dataSource, '', linkedArr)

            let hLength = 0 // 横向最大链路
            let spillHieght = 0 // 溢出高度
            let maxLinked = '' // 最长链路下标串

            linkedArr.forEach((item: string) => {
                const getLength = item.replace(/_/g, '').length
                if (getLength > hLength) {
                    hLength = getLength
                    maxLinked = item
                }
            })

            if (maxLinked) {
                let prevItem = dataSource[0]
                maxLinked.split('_').forEach((item: string, index: number) => {
                    if (item && index !== 1) {
                        const { children } = prevItem
                        if (children && children.length) {
                            if (item === '0') {
                                if (children.length > 2) {
                                    spillHieght += common.baseHeight + common.spaceForTB
                                } else if (children.length > 1) {
                                    spillHieght += (common.baseHeight + common.spaceForTB) / 2
                                }
                            }
                            prevItem = children[item]
                        }
                    }
                })
            }

            setSourceStyle({
                width: `${hLength * common.baseWidth + (hLength - 1) * common.spaceForLR}px`,
                paddingTop: `${spillHieght}px`
            })
        }

        setSourceDom(getSourceDom)

        return () => {
            if (dagWrap.current && base.align === "left") {
                // 横向滚动到最左边
                setTimeout(() => {
                    const dom: any = dagWrap.current
                    dom.scrollLeft = dom.offsetWidth
                    dagWrap.current = null
                }, 0)

            }
        }
    }, [dataSource, config])


    if (!dataSource.length && config) {
        return null
    }

    const { base } = config
    return (
        <div className="dag-wrap" ref={dagWrap}>
            <div className={`dag dag-flex-${base.align}`} style={sourceStyle}>
                <ul className="list">
                    {sourceDom}
                </ul>
            </div>
        </div>
    );
}

export const Dag = memo(DefaultDag)