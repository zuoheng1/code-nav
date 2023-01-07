import React, { useEffect, useState } from 'react'
import { InputNumber, Button, message } from 'antd'
import './index.css'

export default function Index() {
  const initialValue = {
    // name: null,
    weight: 0,
    radio: 0,
  }

  const [kcl, setKcl] = useState({ ...initialValue, name: 'kcl' })
  const [nacl, setNacl] = useState({ ...initialValue, name: 'nacl' })
  const [production, setProduction] = useState({ ...initialValue, name: 'production' })
  const [data, setData] = useState([kcl, nacl, production])
  const [show, setShow] = useState(false)
  useEffect(() => {
    setData([kcl, nacl, production])
  }, [kcl, nacl, production])


  const handleOnClick = () => {
    const isUnAble = data.filter(it => it.radio).length === 2
    if (isUnAble) {
      message.error('请输入两条数据且至少包含一条质量数据，傻🐶')
      return
    }
    setShow(true)
    const sameList = data.filter(it => it.weight && it.radio)
    const diffList = data.filter(it => it.weight || it.radio)
    const isSame = sameList.length === 1
    const isDiff = diffList.length === 2
    if (isSame) {
      const type = sameList[0].name
      const value = sameList.map((it) => ({
        name: it.name,
        weight: it.weight,
        radio: it.radio
      })
      )
      //如果都来自成品
      const val = value[0]
      if (type === 'production') {
        const kclWeight = val.radio / 100 * val.weight
        const naclWeight = val.weight - kclWeight
        const naclPercent = 100 - val.radio
        setNacl({ ...nacl, weight: naclWeight, radio: naclPercent })
        setKcl({ ...kcl, weight: kclWeight, radio: val.radio })
        return
      }
      //如果都来自nacl
      if (type === 'nacl') {
        const totalWeight = val.weight / (val.radio / 100)
        const kclPercent = 100 - val.radio
        const kclWeight = totalWeight * kclPercent / 100
        setKcl({ ...kcl, weight: kclWeight, radio: kclPercent })
        setProduction({ ...production, weight: totalWeight, radio: kclPercent })
        return
      }
      if (type === 'kcl') {
        const totalWeight = val.weight / (val.radio / 100)
        const naclPercent = 100 - val.radio
        const naclWeight = totalWeight * naclPercent / 100
        setNacl({ ...nacl, weight: naclWeight, radio: naclPercent })
        setProduction({ ...production, weight: totalWeight, radio: val.radio })
        return
      }
    }
    if (isDiff) {
      diffList.forEach(it => {
        for (let i in it) {
          if (it[i] === 0) {
            delete it[i]
          }
        }
      })
      const type = diffList.filter(it => it.weight).length
      const isProductionR = diffList.filter(it => it.name === 'production' && it.radio)
      const isProductionW = diffList.filter(it => it.name === 'production' && it.weight)
      const isNoProduction = diffList.filter(it => it.name !== 'production')
      const isKclR = diffList.filter(it => it.name === 'kcl' && it.radio)
      const isKclW = diffList.filter(it => it.name === 'kcl' && it.weight)
      const isNaclR = diffList.filter(it => it.name === 'nacl' && it.radio)
      const isNaclW = diffList.filter(it => it.name === 'nacl' && it.weight)

      switch (type) {
        //rr 不可能
        //wr
        case 1:
          if (isProductionR.length) {
            if (isKclW.length) {
              const totalWeight = isKclW[0].weight / isProductionR[0].radio * 100
              const naclWeight = totalWeight * (100 - isProductionR[0].radio) / 100
              const naclPercent = 100 - isProductionR[0].radio
              setKcl({ ...kcl, radio: isProductionR[0].radio })
              setNacl({ ...nacl, weight: naclWeight, radio: naclPercent })
              setProduction({ ...production, weight: totalWeight })
              return
            } else {
              const totalWeight = isNaclW[0].weight / isProductionR[0].radio * 100
              const kclWeight = totalWeight * (100 - isProductionR[0].radio) / 100
              const kclPercent = 100 - isProductionR[0].radio
              setKcl({ ...kcl, radio: kclPercent, weight: kclWeight })
              setNacl({ ...nacl, radio: 100 - isProductionR[0].radio })
              setProduction({ ...production, weight: totalWeight })
              return
            }
          }
          if (isProductionW.length) {
            if (isKclR.length) {
              const naclWeight = isProductionW[0].weight * (100 - isKclR[0].radio) / 100
              const naclPercent = 100 - isKclR[0].radio
              const kclWeight = isProductionW[0].weight - naclWeight
              setKcl({ ...kcl, weight: kclWeight })
              setNacl({ ...nacl, weight: naclWeight, radio: naclPercent })
              setProduction({ ...production, radio: isKclR[0].radio })
              return
            } else {
              const kclWeight = isProductionW[0].weight * (100 - isNaclR[0].radio) / 100
              const kclPercent = 100 - isNaclR[0].radio
              const naclWeight = isProductionW[0].weight - kclWeight
              setKcl({ ...kcl, weight: kclWeight, radio: kclPercent })
              setNacl({ ...nacl, weight: naclWeight })
              setProduction({ ...production, radio: 100 - isNaclR[0].radio })
              return
            }
          }
          if (isNoProduction.length) {
            console.log('isNoProduction', isNoProduction);
            if (isKclW.length) {
              const totalWeight = isKclW[0].weight / isNaclR[0].radio * 100
              const naclWeight = totalWeight - isKclW[0].weight
              const kclPercent = 100 - isNaclR[0].radio
              setKcl({ ...kcl, radio: kclPercent })
              setNacl({ ...nacl, weight: naclWeight })
              setProduction({ ...production, weight: totalWeight, radio: kclPercent })
              return
            } else {
              const totalWeight = isNaclW[0]?.weight / isKclR[0].radio * 100
              const kclWeight = totalWeight - isNaclW[0].weight
              const naclPercent = 100 - isKclR[0].radio
              setKcl({ ...kcl, weight: kclWeight })
              setNacl({ ...nacl, radio: naclPercent })
              setProduction({ ...production, weight: totalWeight, radio: isKclR[0].radio })
              return
            }
          }
          break;
        //ww
        case 2:
          if (isProductionW.length) {
            if (isKclW.length) {
              const naclWeight = isProductionW[0].weight - isKclW[0].weight
              const naclPercent = naclWeight / isProductionW[0].weight * 100
              const kclPercent = 100 - naclPercent
              setKcl({ ...kcl, radio: kclPercent })
              setNacl({ ...nacl, weight: naclWeight, radio: naclPercent })
              setProduction({ ...production, radio: kclPercent })
              return
            } else {
              const kclWeight = isProductionW[0].weight - isNaclW[0].weight
              const kclPercent = kclWeight / isProductionW[0].weight * 100
              const naclPercent = 100 - kclPercent
              setKcl({ ...kcl, radio: kclPercent, weight: kclWeight })
              setNacl({ ...nacl, radio: naclPercent })
              setProduction({ ...production, radio: kclPercent })
              return
            }
          } else {
            const totalWeight = isKclW[0].weight + isNaclW[0].weight
            const kclPercent = isKclW[0].weight / totalWeight * 100
            const naclPercent = 100 - kclPercent
            setKcl({ ...kcl, radio: kclPercent })
            setNacl({ ...nacl, radio: naclPercent })
            setProduction({ ...production, radio: kclPercent, weight: totalWeight })
          }
          break;
        default:
          break;
      }
    }
  }

  const handleClear = () => {
    setShow(false)
    setKcl({ ...initialValue, name: 'kcl' })
    setNacl({ ...initialValue, name: 'nacl' })
    setProduction({ ...initialValue, name: 'production' })
  }
  return (
    <div className='content'>
      <div >
        <div className='title'>大汉堡🍔的计算器</div>
        <div className='item'>
          <div className='inputTop'>
            <InputNumber
              className='inputWidth'
              value={kcl.weight}
              size='large'
              addonBefore={'Kcl质量'}
              max={100}
              min={0}
              onChange={val => setKcl({ ...kcl, weight: val })} />
          </div>
          <div >
            <InputNumber
              className='inputWidth'
              value={kcl.radio}
              size='large'
              addonBefore={'Kcl质量百分比'}
              max={100}
              min={0}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
              onChange={val => setKcl({ ...kcl, radio: val })} />
          </div>

        </div>
        <div className='item'>
          <div className='inputTop'>
            <InputNumber
              className='inputWidth'
              value={nacl.weight}
              size='large'
              addonBefore={'Nacl质量'}
              max={100}
              min={0}
              onChange={val => setNacl({ ...nacl, weight: val })}
            />
          </div>
          <div>
            <InputNumber
              className='inputWidth'
              value={nacl.radio}
              size='large'
              addonBefore={'Nacl质量百分比'}
              max={100}
              min={0}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
              onChange={val => setNacl({ ...nacl, radio: val })} />
          </div>

        </div>
        <div className='item'>
          <div className='inputTop'>
            <InputNumber
              className='inputWidth'
              size='large'
              value={production.weight}
              addonBefore={'成品质量'}
              max={100}
              min={0}
              onChange={val => setProduction({ ...production, weight: val })} />
          </div>
          <div>
            <InputNumber
              value={production.radio}
              size='large'
              max={100}
              min={0}
              addonBefore={'成品中Kcl质量百分比'}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
              onChange={val => setProduction({ ...production, radio: val })} />
          </div>

        </div>
        <div className='footer'>
          <Button onClick={handleOnClick} size='large' type='dashed' >
            计算
          </Button>
          <Button onClick={handleClear} size='large' danger>
            清空
          </Button>
        </div>

      </div>
      <div className='exhibition' style={{ display: show ? 'block' : 'none' }}>
        <div className='resultTitle'>
          计算结果：（取小数点后两位）
        </div>
        <div className='resultContent'>
          本次使用Kcl质量为<span className='text'>
            ({kcl.weight.toFixed(2)})
          </span>,Nacl质量为<span className='text'>({nacl.weight.toFixed(2)})</span>;所得产品中kcl的质量百分比为<span className='text'>({production.radio.toFixed(2) + '%'})</span>;
          误差范围（1-1.18）,修正后质量百分比范围：<span className='text'>
            （{production.radio.toFixed(2) + '%'}~{(production.radio * 1.18).toFixed(2) + '%'}）
          </span>
        </div>
      </div>
    </div>

  )
}
