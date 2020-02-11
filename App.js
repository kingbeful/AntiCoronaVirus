/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component }  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  SectionList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Echart from './src/echart'

const { width, height } = Dimensions.get('window')

let province = false
const DataItem = props => {
    return(
      <View style={{flex:1, alignItems:'center'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize:12, color:'#808080'}}>较昨日</Text>
          <Text style={{fontSize:12, color:props.color||'red', fontWeight:'bold'}}>{`+${props.incr}`}</Text>
        </View>
        <Text style={{fontSize:18, color:props.color||'red', fontWeight:'bold'}}>{props.count}</Text>
        <Text style={{fontSize:16, color:'black', fontWeight:'bold'}}>{props.name}</Text>
      </View>
    )
  }

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rawData: [],
      loadAreaStatFinished: false,
    }
  }

  componentDidMount() {
    fetch('http://49.232.173.220:3001/data/getAreaStat')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        const area = responseJson.map(item => {return {
          title: item.provinceShortName, 
          confirmed: item.confirmedCount,
          suspected: item.suspectedCount,
          cured: item.curedCount,
          dead: item.deadCount,
          data: item.cities
        }})

        console.log(area)
        this.setState({
          area: area,
          expandedArea: area[0].title,
          rawData: responseJson,
          loadAreaStatFinished: true
        })
      })
      .catch (e => {

      })
    fetch('http://49.232.173.220:3001/data/getStatisticsService')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          confirmedCount:responseJson.confirmedCount,
          suspectedCount:responseJson.suspectedCount,
          curedCount:responseJson.curedCount,
          deadCount:responseJson.deadCount,
          seriousCount:responseJson.seriousCount,

          confirmedIncr:responseJson.confirmedIncr,
          suspectedIncr:responseJson.suspectedIncr,
          curedIncr:responseJson.curedIncr,
          deadIncr:responseJson.deadIncr,
          seriousIncr:responseJson.seriousIncr
        })
      })
      .catch (e => {

      })
  }

  getOption = () => {
    const data = this.state.rawData.map(item => {return {name: item.provinceShortName, value:item.confirmedCount}})
    return {
      title: {
        text: 'WuHan nCorV Map',
        subtext: '不偷，不抢，不撒谎，能明白吗？',
        left: '5%',
        textStyle: {
          fontSize: 16,
          color: '#005AB5'
        }
      },
      visualMap: {
        show: true,
        type: 'piecewise',
        min: 0,
        max: 2000,
        align: 'left',
        top: province ? 0 : '64%',
        right: 'auto',
        left: 0,
        inRange: {
          color: [
            '#FFECEC',
            '#FF9797',
            '#FF0000',
            '#CE0000',
            '#600000',

          ]
        },
        pieces: [
          {min: 1000, label: '> 1000'},
          {min: 500, max: 999, label: '500 - 999'},
          {min: 100, max: 499, label: '100 - 499'},
          {min: 10, max: 99 , label: '10 - 99'},
          {min: 1, max: 9, label: '1 - 9'},
        ],

        padding: 10,
        itemGap: 3,
        orient: province ? 'horizontal' : 'vertical',
        showLabel: true,
        text: ['确诊人数'],
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10
        }
        // "borderWidth": 0
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      series: [{
        left: 'center',
        // top: '15%',
        // bottom: '10%',
        type: 'map',
        name: '确诊人数',
        silent: province ? true : false,
        label: {
          show: true,
          position: 'inside',
          // margin: 8,
          fontSize: 6
        },
        mapType: province ? province.pinyin : 'china',
        data,
        zoom: 1.2,
        roam: false,
        showLegendSymbol: false,
        emphasis: {},
        rippleEffect: {
          show: true,
          brushType: 'stroke',
          scale: 2.5,
          period: 4
        }
      }]
    }
  }

  _sectionItem = data => {
    // console.log(data)
    if (this.state.expandedArea !== data.section.title) {
      return null
    } else {
      return (
        <View style={styles.itemNameContainer} key={data.item.locationId}>
          <Text style={{...styles.itemNameText, fontSize:12}}>{data.item.cityName}</Text>
          <Text style={{...styles.itemNameText, fontSize:12}}>{data.item.confirmedCount}</Text>

          <Text style={{...styles.itemNameText, fontSize:12}}>{data.item.deadCount}</Text>
          <Text style={{...styles.itemNameText, fontSize:12}}>{data.item.curedCount}</Text>
        </View>
      )
    }
  }

  _sectionHeader = data => {
    // console.log(data)
    return (
      <TouchableOpacity style = { styles.sectionHeaderContainer } onPress={()=>{ 
          if (this.state.expandedArea !== data.section.title) {
            this.setState({expandedArea: data.section.title}) 
          }
        }}>
          <Text style={{...styles.itemNameText, fontWeight:'bold'}}>{data.section.title}</Text>
          <Text style={{...styles.itemNameText, fontWeight:'bold'}}>{data.section.confirmed}</Text>

          <Text style={{...styles.itemNameText, fontWeight:'bold'}}>{data.section.dead}</Text>
          <Text style={{...styles.itemNameText, fontWeight:'bold'}}>{data.section.cured}</Text>
      </TouchableOpacity>)
  }

  render () {
    const option = this.state.loadAreaStatFinished ? this.getOption() : {}
    return (
      <View style={{flex:1}}>
        <SafeAreaView style={{flex:1}}>
            <View style={styles.itemNameContainer}>
              <DataItem count={this.state.confirmedCount} incr={this.state.confirmedIncr} name={'确诊'} color={'#EA0000'}/>
              <DataItem count={this.state.suspectedCount} incr={this.state.suspectedIncr} name={'疑似'} color={'#FF8040'}/>
              <DataItem count={this.state.deadCount} incr={this.state.deadIncr} name={'死亡'} color={'#7373B9'}/>
              <DataItem count={this.state.curedCount} incr={this.state.curedIncr} name={'治愈'} color={'#01B468'}/>
            </View>
            <View style={{height:0.5, width:width - 32, margin:16, backgroundColor:'#C0C0C0'}}/>
            {this.state.loadAreaStatFinished ? <Echart option={option} height={300} /> : <View/>}
            <View style={styles.itemNameContainer}>
              <Text style={{...styles.itemNameText, backgroundColor:'#E6CAFF'}}>省份</Text>
              <Text style={{...styles.itemNameText, backgroundColor:'#FFB5B5'}}>确诊</Text>
          
              <Text style={{...styles.itemNameText, backgroundColor:'#F0F0F0'}}>死亡</Text>
              <Text style={{...styles.itemNameText, backgroundColor:'#CEFFCE'}}>治愈</Text>
            </View>
            {
            this.state.loadAreaStatFinished ?
              <SectionList
                removeClippedSubviews={true}
                  sections = { this.state.area }
                  renderItem = { this._sectionItem }
                  renderSectionHeader = { this._sectionHeader }
                  keyExtractor = { (item, index) => index }
              />
              : <View/>
            }
          <View style={{height:32}}>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemNameContainer: {
    width:width,
    flexDirection: 'row'
  },
  itemNameText: {
    flex:1, 
    paddingTop: 4,
    paddingBottom: 4,
    textAlign:'center'
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0'
  }
});

export default App;
