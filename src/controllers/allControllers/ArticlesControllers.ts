import { type Request, type Response } from 'express'
import admin from '../../config/firebase'

const db = admin.firestore()

const controller = {
  getArticles: async (req: Request, res: Response) => {
    try {
      const topic = req.params.topic
      const articleCollection = db.collection('articles')
      const articleSnapshot = await articleCollection
        .where('topic', '==', topic)
        .get()
      if (articleSnapshot.empty) {
        return res.status(404).json({ message: 'Data artikel kosong' })
      }
      const articleData: admin.firestore.DocumentData[] = []
      // Extract data from the query snapshot
      articleSnapshot.forEach((doc) => {
        articleData.push(doc.data())
      })
      res.status(200).json(articleData)
    } catch (error) {
      res.status(500).json({
        status: 'failed',
        message: 'Gagal mendapatkan data artikel'
      })
    }
  },

  getArticleById: async (req: Request, res: Response) => {
    try {
      const topic = req.params.topic
      const articleId = req.params.articleId
      const articleCollection = db.collection('articles')
      const articleSnapshot = await articleCollection
        .where('topic', '==', topic)
        .where('id', '==', articleId)
        .get()
      if (articleSnapshot.empty) {
        return res.status(404).json({ message: 'Data artikel kosong' })
      }
      const articleData: admin.firestore.DocumentData[] = []
      // Extract data from the query snapshot
      articleSnapshot.forEach((doc) => {
        articleData.push(doc.data())
      })
      res.status(200).json(articleData)
    } catch (error) {
      console.error(error)
      res.status(500).json({
        status: 'failed',
        message: 'Gagal mendapatkan data artikel'
      })
    }
  },

  searchArticle: async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string
      const articleCollection = db.collection('articles')
      const articleSnapshot = await articleCollection
        .where('title', '>=', search)
        .where('title', '<=', search + '~')
        .limit(10)
        .get()
      if (articleSnapshot.empty) {
        return res.status(404).json({ message: 'Artikel tidak ditemukan' })
      }
      const articleData: admin.firestore.DocumentData[] = []
      // Extract data from the query snapshot
      articleSnapshot.forEach((doc) => {
        articleData.push(doc.data())
      })
      res.status(200).json(articleData)
    } catch (error) {
      res.status(500).json({
        status: 'failed',
        message: 'Gagal mendapatkan data artikel'
      })
    }
  }

}

export default controller
