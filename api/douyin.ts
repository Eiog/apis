/* eslint-disable prefer-promise-reject-errors */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { get } from 'object-path'
import { sign } from '../public/x-bogus'

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
}
const douyinApiHeaders = {
  'accept-encoding': 'gzip, deflate, br',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'referer': 'https://www.douyin.com/',
  'cookie': 'n_mh=ZGkDUDq87_ReJpNDNjXJAcIlxSe3cA3dXF3pz7Vo1So; LOGIN_STATUS=1; store-region=cn-ah; store-region-src=uid; my_rd=1; ttwid=1%7CLkU2OLnKWs8DcVLGMP_dxHcLobk9Y_e-SSDlUKglsiM%7C1687349374%7C7ea67aa5225ad7fcef78191fd87dea42b2281cd2ffe1bcb205c5b9d5fe3f3ff7; s_v_web_id=verify_lkcquhow_M0SokhHW_aHUZ_4ui0_92nd_t45hIoyFwlF0; passport_csrf_token=ae1d4b9e0f6b3dd26dcdd858c74f1373; passport_csrf_token_default=ae1d4b9e0f6b3dd26dcdd858c74f1373; passport_assist_user=CjzG2846zH4nSFD12e3ghPYNBgVTysxLmt3P0hRO1e6x0z-quOC5aMrxB3mrdK60HTBt9XFvCfBsq5MfKqYaSAo8hG-cIbPHcQ1Aue3pau4dTSAcJ3AeIR8-NqaW0lrmyWdtRikQRByqm7IPca9yb-aF6r41GhlvdFAoD8gzEIq_uA0Yia_WVCIBA_D4Aq0%3D; sso_uid_tt=9630cb01a699aa5c33a8808e718ec11b; sso_uid_tt_ss=9630cb01a699aa5c33a8808e718ec11b; toutiao_sso_user=996cb6a83b1c5c2b713af855b64cc098; toutiao_sso_user_ss=996cb6a83b1c5c2b713af855b64cc098; odin_tt=5308c2d274686bdafa9204700857b3e8f169e15e0c9caadc1cf46bea997712ecb32029d28f08ad7147305fa071c5ba5a; uid_tt=d26841f0ed166bbf0e8fbba5a6eddd4e; uid_tt_ss=d26841f0ed166bbf0e8fbba5a6eddd4e; sid_tt=69b218330b62e948d2f62a8f1a8e698c; sessionid=69b218330b62e948d2f62a8f1a8e698c; sessionid_ss=69b218330b62e948d2f62a8f1a8e698c; _bd_ticket_crypt_cookie=9c7b4fc95ad98147cf18ff9498c897fc; __security_server_data_status=1; __live_version__=%221.1.1.3119%22; sid_ucp_sso_v1=1.0.0-KDcwNGVmYjFiMjJiMDkwYmY1Y2ZmOGVhYjc0ZWYyMWQ2Y2M2ZGM1NzAKHQj2h_PV7gEQqoTLpwYY7zEgDDCgos3LBTgGQPQHGgJobCIgOTk2Y2I2YTgzYjFjNWMyYjcxM2FmODU1YjY0Y2MwOTg; ssid_ucp_sso_v1=1.0.0-KDcwNGVmYjFiMjJiMDkwYmY1Y2ZmOGVhYjc0ZWYyMWQ2Y2M2ZGM1NzAKHQj2h_PV7gEQqoTLpwYY7zEgDDCgos3LBTgGQPQHGgJobCIgOTk2Y2I2YTgzYjFjNWMyYjcxM2FmODU1YjY0Y2MwOTg; sid_guard=69b218330b62e948d2f62a8f1a8e698c%7C1693631018%7C5184000%7CWed%2C+01-Nov-2023+05%3A03%3A38+GMT; sid_ucp_v1=1.0.0-KDg2ZDc3NDdmYzFlNGIyM2FkM2ZjN2RjMjQ1MjQ2MzQ3MmJhZWYwYmIKGQj2h_PV7gEQqoTLpwYY7zEgDDgGQPQHSAQaAmxxIiA2OWIyMTgzMzBiNjJlOTQ4ZDJmNjJhOGYxYThlNjk4Yw; ssid_ucp_v1=1.0.0-KDg2ZDc3NDdmYzFlNGIyM2FkM2ZjN2RjMjQ1MjQ2MzQ3MmJhZWYwYmIKGQj2h_PV7gEQqoTLpwYY7zEgDDgGQPQHSAQaAmxxIiA2OWIyMTgzMzBiNjJlOTQ4ZDJmNjJhOGYxYThlNjk4Yw; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCSi9YaFJNYkE1RlVGUzlldjFzcXpWZXNuRktqUmNxSjFnam9GQmdOMlJKclo3Wnc4N1JKTjZMdnZNV2lTLzFuWkorZFNqdUd5QWEvTHp3T2o4ZjhJbkk9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ==; __ac_nonce=065066d6d00dcec9d7f9d; __ac_signature=_02B4Z6wo00f01L2LOtwAAIDBQ8dG7f90QiS9qz5AAEppU8rmnlMQQsT0Wn6rUXj7BV7tk8Gud6ZIrtX.3ZI2WrJGBOfZkNeKvNOfm3PthvMBa4wmCicgabm09qyR4wvj-p4okPGfy5oYGH8R58; publish_badge_show_info=%220%2C0%2C0%2C1694920048606%22; home_can_add_dy_2_desktop=%220%22; strategyABtestKey=%221694920048.622%22; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAA1T1gJAQars4T_ve8V3T5Ld9J3GCAsNLpTlr6EhV36C0%2F1694966400000%2F0%2F1694920048827%2F0%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Afalse%2C%22volume%22%3A0.056%7D; csrf_session_id=6c84522dbdac6372ee9ae3ffbe850bcf; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1920%2C%5C%22screen_height%5C%22%3A1080%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A12%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A100%7D%22; passport_fe_beating_status=true; msToken=4UD4cbYDcXUIVw66rmBqxwfRBKQfv0PaBaFZzMUt40-f92dR4decmUv4J334pfUdfukAVOEo5Kfmj-SjJh_gU8H03z1GZ1nDw8RWJRJp2wXSjlcNrBcoQw==; msToken=pG-e7TIA9uAyR8ui6-WI5IicyjjjOSkdNPwgIx_wqDzZxKz9ca3DPcZkzgiCByT4wcdWKKRrvt2MkRXB7q5auYl5wZZCxwBfhK8AfLebhBJm7HJaU1cKyw==; tt_scid=lb4xIawlluUIQ5M7sNX4dyoz.AvNwFZb9wJzYhW0Q6817bpVd84GEg3G.LUSKlgTa71b; download_guide=%222%2F20230917%2F0%22;',
}
function getUrlByShareUrl(shareUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reg = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    const url = shareUrl.match(reg)
    if (url && url?.length > 0)
      return resolve(url[0])
    return reject('url中不包含可解析链接')
  })
}
function getRealUrlByShareUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (url && url.includes('douyin') && url.includes('v.douyin')) {
      fetch(url, {
        method: 'GET',
        headers,
        redirect: 'manual',
      }).then((res) => {
        if (res.status === 302) {
          const locationHeader = res.headers.get('Location')
          const redirectUrl = locationHeader ? locationHeader.split('?')[0] : locationHeader
          return resolve(redirectUrl as string)
        }
        else {
          return reject(res.toString())
        }
      }).catch((err) => {
        return reject(err.toString())
      })
    }
    else {
      return reject('url错误')
    }
  })
}
function generateXBogusUrl(url: string) {
  const query = new URL(url).searchParams.toString()
  const xbogus = sign(query, headers['User-Agent'])
  return `${url}&X-Bogus=${xbogus}`
}
function getDouyinVideoIdByRealUrl(realUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (realUrl.includes('/video/')) {
      const ids = realUrl.match(/\/video\/(\d+)?/)
      if (ids && ids.length > 0)
        return resolve(ids[0].replace('/video/', ''))
      return reject('videoId不存在')
    }
    if (realUrl.includes('discover?')) {
      const ids = realUrl.match(/modal_id=(\d+)/)
      if (ids && ids.length > 0)
        return resolve(ids[0])
      return reject('videoId不存在')
    }
    return reject('videoId不存在')
  })
}
function getDouyinVideoData(videoId: string): Promise<{ [key: string]: any }> {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.douyin.com/aweme/v1/web/aweme/detail/?device_platform=webapp&aid=6383&channel=channel_pc_web&aweme_id=${videoId}&pc_client_type=1&version_code=190500&version_name=19.5.0&cookie_enabled=true&screen_width=1344&screen_height=756&browser_language=zh-CN&browser_platform=Win32&browser_name=Firefox&browser_version=110.0&browser_online=true&engine_name=Gecko&engine_version=109.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=&platform=PC&webid=7158288523463362079&msToken=abL8SeUTPa9-EToD8qfC7toScSADxpg6yLh2dbNcpWHzE0bT04txM_4UwquIcRvkRb9IU8sifwgM1Kwf1Lsld81o9Irt2_yNyUbbQPSUO8EfVlZJ_78FckDFnwVBVUVK`
    const newApiUrl = generateXBogusUrl(apiUrl)
    axios.get(newApiUrl, { headers: douyinApiHeaders, responseType: 'json' }).then((res) => {
      return resolve(res.data.aweme_detail)
    }).catch(() => {
      return reject('request failed')
    })
  })
}
function formatDouyinVideoData(data: any) {
  return {
    author: {
      avatar_thumb: get(data, 'author.avatar_thumb.url_list.0'),
      nickname: get(data, 'author.nickname'),
      sec_uid: get(data, 'author.sec_uid'),
      uid: get(data, 'author.uid'),
    },
    music: {
      title: get(data, 'music.title'),
      url: get(data, 'music.play_url.uri'),
    },
    video: {
      cover: get(data, 'video.origin_cover.url_list'),
      url: get(data, 'video.play_addr.url_list'),
    },
    image: {},
  }
}
function getHomeVideoBySecUid(secUid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const maxCursor = 0
    const apiUrl = `https://www.douyin.com/aweme/v1/web/aweme/post/?sec_user_id=${secUid}&count=35&max_cursor=${maxCursor}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`
    const newApiUrl = generateXBogusUrl(apiUrl)
    axios.get(newApiUrl, { headers: douyinApiHeaders, responseType: 'json' }).then((res) => {
      return resolve(res.data)
    }).catch(() => {
      return reject('request failed')
    })
  })
}
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const shareUrl: string = request.query.url || request.body.url
  if (!shareUrl) {
    return response.status(400).json({
      statusCode: 400,
      body: 'url is required',
    })
  }
  try {
    const url = await getUrlByShareUrl(shareUrl)
    const realUrl = await getRealUrlByShareUrl(url)
    const videoId = await getDouyinVideoIdByRealUrl(realUrl)
    const videoData = await getDouyinVideoData(videoId)
    const data = formatDouyinVideoData(videoData)
    const homeData = await getHomeVideoBySecUid(data.author.sec_uid)
    response.send({ statusCode: 200, body: { videoId, data, homeData } })
  }
  catch (error: any) {
    response.send({ statusCode: 200, body: { error: error.toString() } })
  }
}
