import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionnaireLocalStorageService } from '../../services/questionnaire-local-storage.service';
import { Topics} from '../../models/topics.model';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-topic-test',
  templateUrl: './topic-test.component.html',
  styleUrls: ['./topic-test.component.scss']
})
export class TopicTestComponent implements OnInit {
  topicSearch: Topics = new Topics();
  topic: Topic;
  nextTopic: Topic; // следующий выбранный топик
  prevTopic: Topic; // предыдущий выбранный топик
  loaded: Boolean = false;
  loading: Boolean = false;

  constructor(private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadTopics();
  }

  // загрузить топик
  loadTopics(): void {
    this.loaded = false;
    this.loading = true;

    this.questionnaire.topics()
      .subscribe(
        this.onLoadTopicsSuccess.bind(this),
        this.onLoadTopicsError.bind(this)
      );
  }

  onLoadTopicsSuccess(topics: Topics): void {
    const key = this.route.snapshot.paramMap.get('key');

    topics.topics = topics.topics.map(t => this.localStorage.loadTopic(t));
    this.topicSearch = topics;

    const topic = this.topicSearch.topics.find(t => t.key === key);
    if (topic) {
      this.topic = topic;
      this.loaded = true;
      this.setSelected(true);
    }

    this.prevTopic = this.topicSearch.prevTopic(key);
    this.nextTopic = this.topicSearch.nextTopic(key);

    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
    console.log(error);
  }

  setSelected(value): void {
    if (this.topic && this.topic.selected !== value) {
      this.topic.selected = value;
      this.saveTopic();
    }
  }

  saveTopic(): void {
    if (this.topic) {
      this.localStorage.saveTopic(this.topic);
    }
  }
}
