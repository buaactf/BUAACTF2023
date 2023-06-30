(function() {
	var $ = jQuery.noConflict();

	function getInfo(uid, cb) {
		var params = {
			ac: "namecard",
			uid: uid
		};

		$.get("cp.php", params, function(data) {
			cb(null, data);
		}, "json").error(function() {
			cb('network-error');
		});
	}

	function InfoCard(el) {
		var self = this;
		this.el = el;
		this.$el = $(el);
		this.uid = this.$el.data("uid");

		this.$inner = this.$el.find(".info-card-inner");
		this.$mask = this.$inner.find(".loading-mask");
		this.status = "initialized";
		this.actived = false;

		this.$el.find("button.btn").click(function() {
			self.$el.removeClass("active");
		});
		this.$el.hover(function() {
			self.active();
		}, function() {
			self.actived = false;
			self.$el.removeClass("active");
		});
	}

	InfoCard.prototype.active = function() {
		var self = this;

		this.actived = true;
		this.$el.addClass("active");

		if (this.status !== "initialized") {
			return;
		}

		this.status = "pending";
		getInfo(this.uid, function(err, data) {
			setTimeout(function() {
				self.$mask.hide();
				self.status = "done";

				if (err) {
					return;
				}

				self.data = data;
				self.$inner.find(".name a").html(data.name)
				self.$inner.find(".name").show();
				if ('duty' in data) {
					self.$inner.find(".duty").html("部门职能：" + (data.duty||'(暂无简介)')).show();
				} else {
					if (data.edu) {
						self.$inner.find(".edu").html(data.edu).show();
					}
					if (data.work) {
						self.$inner.find(".department").html("单位：" + data.work).show();
					}
				}
				
				if (self.actived) {
					self.$el.addClass("active");
				}
			}, 2000);
		});
	};

	$(document).on("hover", "[data-provide=info-card]", function() {
		var $this = $(this);
		if ($this.data("info-card")) {
			return;
		}

		var card = new InfoCard(this);
		$this.data("info-card", card);
		card.active();
	});
})();