import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  articles: Article[] = [];
  selectedArticle: Article | null = null;
  showModal = false;
  showDetails = false;
  isEditMode = false;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.articleService.getAll().subscribe(data => this.articles = data);
    console.log(this.articles)
  }

  openModal(article?: Article) {
    this.selectedArticle = article ? { ...article } : {
      artCode: '',
      artIsNegoce: false,
      artLibC: '',
      artLibL: '',
      artLstSoc: '',
      artPu: 0,
      artPua: 0,
      artQteMin: 0,
      artQteMinA: 0,
      artType: '',
      uniteAchat: '',
      unite: ''
    };
    this.isEditMode = !!article;
    this.showModal = true;
  }

  openDetails(article: Article) {
    this.selectedArticle = article;
    this.showDetails = true;
  }

  closeModal() {
    this.showModal = false;
    this.showDetails = false;
  }

  saveArticle() {
    if (this.selectedArticle) {
      if (this.isEditMode) {
        this.articleService.update(this.selectedArticle.id!, this.selectedArticle).subscribe(() => {
          this.loadArticles();
          this.closeModal();
        });
      } else {
        this.articleService.create(this.selectedArticle).subscribe(() => {
          this.loadArticles();
          this.closeModal();
        });
      }
    }
  }

  deleteArticle(id: number) {
    if (confirm('Supprimer cet article ?')) {
      this.articleService.delete(id).subscribe(() => this.loadArticles());
    }
  }
}