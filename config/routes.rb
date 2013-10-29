TemplateEditer::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  root to: 'Home#index'

  get 'template' => 'Home#template', as: 'template'
  match 'template/skim' => 'Home#skim', as: 'skim_template'
  match 'template/edit' => 'Home#edit', as: 'edit_template'
  get 'template/zip'    => 'Home#zip',  as: 'zip_template'
  get 'template/upload' => 'Home#upload', as: 'upload_template'
  get 'file' => 'Home#static_file', as: 'static_file'
  get 'article/:id' => 'Home#article', as: 'article_item'
  get 'collections/:type' => 'Home#skim', as: 'collection'
  match 'api/:id' => 'Home#api', as: 'm_api'
  match 'element/comments' => 'Home#element_comment', as: 'element_comment'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
