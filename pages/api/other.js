/**
 * 考勤
 * 空教室
 * 校历
 * 考试
 * 免登录数据
 */

const R = require("../../utils/request");

// 获取考勤记录
function getAttendanceList(){
  return R({
    url: 'attendance/getList'
  })
}

// 更新考勤记录
function updateAttendanceList(){
  return R({
    url: 'attendance/update'
  })
}

// 获取教学楼
function getFloors(data){
  return R({
    url: '/Emptyroom/getFloors',
    needLogin: false,
    data
  })
}

// 获取空教室
function getEmptyRoom(data){
  return R({
    url:'Emptyroom/getEmptyRoom',
    needLogin: false,
    data
  })
}

// 获取校历
function getCalendarList(){
  return R({
    url: 'calendar/getCalendarList',
    needLogin: false
  })
}

// 获取等级考试列表
function getExamList(){
  return R({
    url: 'exam/getmylist'
  })
}

// 获取班级列表
function getExamClassList(data){
  return R({
    url:'exam/getClassList',
    data
  })
}

// 获取期末考试列表
function getCourseExamList(data){
  return R({
    url: 'exam/getlist',
    data
  })
}

// 编辑考试记录
function editExam(data){
  return R({
    url: 'exam/editlist',
    data
  })
}

// 获取班级列表
function getClassList(data){
  return R({
    url:'Classes/getClassList',
    needLogin:false,
    data
  })
}

// 获取课表分享者信息
function getCourseShareInfo(data){
  return R({
    url:'data/getNameByStuId',
    data,
    needLogin:false
  })
}

module.exports = {
  getAttendanceList,
  updateAttendanceList,
  getFloors,
  getEmptyRoom,
  getCalendarList,
  getExamList,
  getCourseExamList,
  getExamClassList,
  editExam,
  getClassList,
  getCourseShareInfo
}